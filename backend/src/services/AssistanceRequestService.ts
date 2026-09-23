import { assistanceRequestRepository } from "../repositories/AssistanceRequestRepository";
import { routePlanRepository } from "../repositories/RoutePlanRepository";
import { flowEventRepository } from "../repositories/FlowEventRepository";
import { routePlanService } from "./RoutePlanService";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ServiceError } from "../utils/ServiceError";
import { toAuditTarget } from "../utils/formatters";
import type { AssistanceRequest } from "../models/AssistanceRequest";
import type { AssistanceAcceptPayload } from "../types/AssistanceRequestPayload";

export interface AssistanceAcceptResult {
  request: AssistanceRequest;
  changed: boolean;
}

export const assistanceRequestService = {
  list: () => assistanceRequestRepository.findAll(),
  create: (row: unknown) => assistanceRequestRepository.save(row),

  // 调度员接单：路线存在未关闭的高优先级障碍时拒绝接单，请求保留为待接单。
  accept: (id: number, payload: AssistanceAcceptPayload): AssistanceAcceptResult => {
    const request = assistanceRequestRepository.findById(id);
    if (!request) {
      throw new ServiceError(404, ERROR_CODES.ASSISTANCE_REQUEST_NOT_FOUND, ERROR_MESSAGES.ASSISTANCE_REQUEST_NOT_FOUND);
    }
    const helperId = Number(payload?.helper_id ?? 0);
    if (request.status === "ACCEPTED") {
      // 同一调度员重复接单返回现状，不重复变更、不重复记日志。
      if (request.helper_id === helperId) return { request, changed: false };
      throw new ServiceError(409, ERROR_CODES.ASSISTANCE_STATE_CONFLICT, ERROR_MESSAGES.ASSISTANCE_STATE_CONFLICT);
    }
    if (request.status !== "REQUESTED") {
      throw new ServiceError(409, ERROR_CODES.ASSISTANCE_STATE_CONFLICT, ERROR_MESSAGES.ASSISTANCE_STATE_CONFLICT);
    }
    const route = routePlanRepository.findById(request.route_plan_id);
    if (!route) {
      throw new ServiceError(404, ERROR_CODES.ROUTE_PLAN_NOT_FOUND, ERROR_MESSAGES.ROUTE_PLAN_NOT_FOUND);
    }
    const openBarriers = routePlanService.findOpenBlockingBarriers(route);
    if (openBarriers.length > 0) {
      flowEventRepository.append({
        route_id: route.id,
        event_type: "ACCEPT_BLOCKED",
        message: `协助请求 #${id} 接单被拒绝：障碍尚未关闭`
      });
      console.info(LOG_TEMPLATES.AssistanceRequest[5], toAuditTarget("AssistanceRequest", id));
      throw new ServiceError(409, ERROR_CODES.ROUTE_BLOCKED_BY_BARRIER, ERROR_MESSAGES.ROUTE_BLOCKED_BY_BARRIER, {
        open_barrier_ids: openBarriers.map((barrier) => barrier.id)
      });
    }
    const updated = assistanceRequestRepository.update(id, { status: "ACCEPTED", helper_id: helperId });
    if (!updated) {
      throw new ServiceError(404, ERROR_CODES.ASSISTANCE_REQUEST_NOT_FOUND, ERROR_MESSAGES.ASSISTANCE_REQUEST_NOT_FOUND);
    }
    flowEventRepository.append({
      route_id: route.id,
      event_type: "ACCEPT_SUCCEEDED",
      message: `协助请求 #${id} 已由调度员 ${helperId} 接单`
    });
    console.info(LOG_TEMPLATES.AssistanceRequest[4], toAuditTarget("AssistanceRequest", id));
    return { request: updated, changed: true };
  }
};
