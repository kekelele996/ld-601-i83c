import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { routePlanRepository } from "../repositories/RoutePlanRepository";
import { flowEventRepository } from "../repositories/FlowEventRepository";
import { routePlanService } from "./RoutePlanService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { REVIEW_TARGET_STATUS, type ReviewAction } from "../constants/ReviewAction";
import { FLOW_EVENT_TYPES } from "../constants/FlowEventType";
import { createBusinessError } from "../utils/businessError";
import { createBarrierReportReviewResultDto } from "../constructors/BarrierReportDtoFactory";

export const barrierReportService = {
  list: () => barrierReportRepository.findAll(),
  create: (row: unknown) => barrierReportRepository.save(row),

  review(id: number, action: string) {
    const report = barrierReportRepository.findById(id);
    if (!report) {
      throw createBusinessError(404, ERROR_CODES.REPORT_NOT_FOUND, ERROR_MESSAGES.REPORT_NOT_FOUND);
    }
    const normalizedAction = action.trim().toUpperCase();
    const targetStatus = REVIEW_TARGET_STATUS[normalizedAction as ReviewAction];
    if (!targetStatus) {
      throw createBusinessError(400, ERROR_CODES.INVALID_REVIEW_ACTION, ERROR_MESSAGES.INVALID_REVIEW_ACTION);
    }
    // Idempotent: a repeated review result must not affect routes twice.
    if (report.verify_status === targetStatus || report.verify_status === "CLOSED") {
      return createBarrierReportReviewResultDto({ report, duplicated: true, affected_routes: [] });
    }
    const affectedRoutes = routePlanRepository.findByFacilityId(report.facility_id);
    barrierReportRepository.update(id, { verify_status: targetStatus });
    const template = normalizedAction === "VERIFY" ? LOG_TEMPLATES.BarrierReport.review : LOG_TEMPLATES.BarrierReport.close;
    for (const route of affectedRoutes) {
      flowEventRepository.append({
        route_plan_id: route.id,
        event_type: FLOW_EVENT_TYPES.BARRIER_REVIEWED,
        ref_type: "BarrierReport",
        ref_id: report.id,
        detail: `${template}: BarrierReport#${report.id} -> ${targetStatus}`
      });
    }
    const affected = routePlanService.recalculateForFacility(report.facility_id);
    return createBarrierReportReviewResultDto({
      report: barrierReportRepository.findById(id),
      duplicated: false,
      affected_routes: affected
    });
  }
};
