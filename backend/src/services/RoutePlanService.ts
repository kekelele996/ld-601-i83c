import { routePlanRepository } from "../repositories/RoutePlanRepository";
import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { flowEventRepository } from "../repositories/FlowEventRepository";
import { FLOW_EVENT_TYPES } from "../constants/FlowEventType";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createRoutePlanFlowDto } from "../constructors/RoutePlanDtoFactory";
import type { RiskLevel } from "../constants/RiskLevel";

export const routePlanService = {
  list: () => routePlanRepository.findAll(),
  create: (row: unknown) => routePlanRepository.save(row),

  listOpenHighPriorityReports(routeId: number) {
    const route = routePlanRepository.findById(routeId);
    if (!route) return [];
    return barrierReportRepository.findOpenHighPriorityByFacilityIds(route.facility_ids);
  },

  recalculateForFacility(facilityId: number) {
    const affected = [];
    for (const route of routePlanRepository.findByFacilityId(facilityId)) {
      const openReports = barrierReportRepository.findOpenHighPriorityByFacilityIds(route.facility_ids);
      const nextRisk: RiskLevel = openReports.length > 0 ? "HIGH" : "LOW";
      const changed = nextRisk !== route.risk_level;
      if (changed) {
        const previousRisk = route.risk_level;
        routePlanRepository.updateRiskLevel(route.id, nextRisk);
        flowEventRepository.append({
          route_plan_id: route.id,
          event_type: FLOW_EVENT_TYPES.ROUTE_RISK_CHANGED,
          ref_type: "RoutePlan",
          ref_id: route.id,
          detail: `${LOG_TEMPLATES.RoutePlan.riskRecalculated}: ${previousRisk} -> ${nextRisk}`
        });
      }
      affected.push({
        route: routePlanRepository.findById(route.id),
        changed,
        open_barrier_report_ids: openReports.map((report) => report.id)
      });
    }
    return affected;
  },

  getFlow(routeId: number) {
    const route = routePlanRepository.findById(routeId);
    if (!route) return null;
    return createRoutePlanFlowDto({
      route,
      open_barrier_reports: barrierReportRepository.findOpenHighPriorityByFacilityIds(route.facility_ids),
      events: flowEventRepository.findByRoutePlanId(routeId)
    });
  }
};
