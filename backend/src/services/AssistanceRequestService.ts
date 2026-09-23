import { assistanceRequestRepository } from "../repositories/AssistanceRequestRepository";
import { routePlanRepository } from "../repositories/RoutePlanRepository";
import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { flowEventRepository } from "../repositories/FlowEventRepository";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { FLOW_EVENT_TYPES } from "../constants/FlowEventType";
import { createBusinessError } from "../utils/businessError";
import { createAssistanceAcceptResultDto } from "../constructors/AssistanceRequestDtoFactory";

export const assistanceRequestService = {
  list: () => assistanceRequestRepository.findAll(),
  create: (row: unknown) => assistanceRequestRepository.save(row),

  accept(id: number, actor: { id: number }) {
    const request = assistanceRequestRepository.findById(id);
    if (!request) {
      throw createBusinessError(404, ERROR_CODES.REQUEST_NOT_FOUND, ERROR_MESSAGES.REQUEST_NOT_FOUND);
    }
    // Idempotent: accepting an already accepted request changes nothing.
    if (request.status === "ACCEPTED") {
      return createAssistanceAcceptResultDto({ request, duplicated: true });
    }
    if (request.status !== "REQUESTED") {
      throw createBusinessError(400, ERROR_CODES.REQUEST_NOT_ACCEPTABLE, ERROR_MESSAGES.REQUEST_NOT_ACCEPTABLE);
    }
    const route = routePlanRepository.findById(request.route_plan_id);
    if (!route) {
      throw createBusinessError(404, ERROR_CODES.ROUTE_NOT_FOUND, ERROR_MESSAGES.ROUTE_NOT_FOUND);
    }
    const openReports = barrierReportRepository.findOpenHighPriorityByFacilityIds(route.facility_ids);
    if (openReports.length > 0) {
      flowEventRepository.append({
        route_plan_id: route.id,
        event_type: FLOW_EVENT_TYPES.ASSISTANCE_ACCEPT_REJECTED,
        ref_type: "AssistanceRequest",
        ref_id: request.id,
        detail: `${LOG_TEMPLATES.AssistanceRequest.acceptRejected}: open BarrierReport#${openReports.map((report) => report.id).join(",#")}`
      });
      throw createBusinessError(409, ERROR_CODES.ROUTE_HAS_OPEN_BARRIER, ERROR_MESSAGES.ROUTE_HAS_OPEN_BARRIER);
    }
    assistanceRequestRepository.update(id, { status: "ACCEPTED", helper_id: actor.id });
    flowEventRepository.append({
      route_plan_id: route.id,
      event_type: FLOW_EVENT_TYPES.ASSISTANCE_ACCEPTED,
      ref_type: "AssistanceRequest",
      ref_id: request.id,
      detail: `${LOG_TEMPLATES.AssistanceRequest.accept}: AssistanceRequest#${request.id}`
    });
    return createAssistanceAcceptResultDto({ request: assistanceRequestRepository.findById(id), duplicated: false });
  }
};
