import { routePlanRepository } from "../repositories/RoutePlanRepository";
import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { assistanceRequestRepository } from "../repositories/AssistanceRequestRepository";
import { flowEventRepository } from "../repositories/FlowEventRepository";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ServiceError } from "../utils/ServiceError";
import { toAuditTarget } from "../utils/formatters";
import type { RoutePlan } from "../models/RoutePlan";
import type { BarrierReport } from "../models/BarrierReport";
import type { RouteRiskLevel } from "../constants/RouteRiskLevel";

export interface RouteRiskUpdate {
  route_id: number;
  previous_risk_level: RouteRiskLevel;
  risk_level: RouteRiskLevel;
  changed: boolean;
}

// 已核实且未关闭的高优先级障碍才会把路线锁成高风险。
export const isBlockingBarrier = (report: BarrierReport): boolean =>
  report.verify_status === "VERIFIED" && report.priority === "HIGH";

export const routePlanService = {
  list: () => routePlanRepository.findAll(),
  create: (row: unknown) => routePlanRepository.save(row),

  findOpenBlockingBarriers: (route: RoutePlan): BarrierReport[] =>
    barrierReportRepository
      .findAll()
      .filter((report) => isBlockingBarrier(report) && route.facility_ids.includes(report.facility_id)),

  // 风险是由未关闭障碍推导出来的，重复触发只会收敛到同一状态，天然幂等。
  recomputeRiskForFacility: (facilityId: number): RouteRiskUpdate[] => {
    const updates: RouteRiskUpdate[] = [];
    for (const route of routePlanRepository.findByFacilityId(facilityId)) {
      const blocked = routePlanService.findOpenBlockingBarriers(route).length > 0;
      const target: RouteRiskLevel = blocked ? "HIGH" : "LOW";
      const changed = route.risk_level !== target;
      if (changed) {
        routePlanRepository.update(route.id, { risk_level: target });
        flowEventRepository.append({
          route_id: route.id,
          event_type: "ROUTE_RISK_CHANGED",
          message: `路线风险由 ${route.risk_level} 调整为 ${target}`
        });
        console.info(LOG_TEMPLATES.RoutePlan[4], toAuditTarget("RoutePlan", route.id), route.risk_level, "->", target);
      }
      updates.push({ route_id: route.id, previous_risk_level: route.risk_level, risk_level: target, changed });
    }
    return updates;
  },

  // 障碍审核 -> 路线风险 -> 协助接单 的可查询联动视图。
  getRiskFlow: (routeId: number) => {
    const route = routePlanRepository.findById(routeId);
    if (!route) {
      throw new ServiceError(404, ERROR_CODES.ROUTE_PLAN_NOT_FOUND, ERROR_MESSAGES.ROUTE_PLAN_NOT_FOUND);
    }
    const barriers = barrierReportRepository
      .findAll()
      .filter((report) => route.facility_ids.includes(report.facility_id))
      .map((report) => ({ ...report, blocks_route: isBlockingBarrier(report) }));
    const openBarriers = barriers.filter((report) => report.blocks_route);
    const blockReason = openBarriers.length > 0 ? ERROR_MESSAGES.ROUTE_BLOCKED_BY_BARRIER : null;
    const requests = assistanceRequestRepository.findByRoutePlanId(route.id).map((request) => ({
      ...request,
      accept_allowed: request.status === "REQUESTED" && openBarriers.length === 0,
      block_reason: request.status === "REQUESTED" ? blockReason : null
    }));
    return {
      route,
      open_barriers: openBarriers,
      barriers,
      assistance_requests: requests,
      events: flowEventRepository.findByRouteId(route.id)
    };
  }
};
