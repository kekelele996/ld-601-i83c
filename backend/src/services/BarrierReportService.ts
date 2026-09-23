import { barrierReportRepository } from "../repositories/BarrierReportRepository";
import { flowEventRepository } from "../repositories/FlowEventRepository";
import { routePlanService } from "./RoutePlanService";
import type { RouteRiskUpdate } from "./RoutePlanService";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ServiceError } from "../utils/ServiceError";
import { toAuditTarget } from "../utils/formatters";
import type { BarrierReport } from "../models/BarrierReport";
import type { BarrierReviewPayload } from "../types/BarrierReportPayload";

export interface BarrierReviewResult {
  report: BarrierReport;
  changed: boolean;
  route_updates: RouteRiskUpdate[];
}

const invalidReviewAction = () =>
  new ServiceError(400, ERROR_CODES.INVALID_REVIEW_ACTION, ERROR_MESSAGES.INVALID_REVIEW_ACTION);

export const barrierReportService = {
  list: () => barrierReportRepository.findAll(),
  create: (row: unknown) => barrierReportRepository.save(row),

  // 巡检员核实/关闭障碍；重复提交同一处理结果直接返回现状，不再触碰路线。
  review: (id: number, payload: BarrierReviewPayload): BarrierReviewResult => {
    const report = barrierReportRepository.findById(id);
    if (!report) {
      throw new ServiceError(404, ERROR_CODES.BARRIER_REPORT_NOT_FOUND, ERROR_MESSAGES.BARRIER_REPORT_NOT_FOUND);
    }
    const action = payload?.action;
    if (action === "verify") {
      if (report.verify_status === "VERIFIED") return { report, changed: false, route_updates: [] };
      if (report.verify_status !== "PENDING") throw invalidReviewAction();
      return applyReview(id, "VERIFIED", LOG_TEMPLATES.BarrierReport[4], "BARRIER_VERIFIED", `障碍工单 #${id} 已核实`);
    }
    if (action === "close") {
      if (report.verify_status === "CLOSED") return { report, changed: false, route_updates: [] };
      if (report.verify_status !== "VERIFIED") throw invalidReviewAction();
      return applyReview(id, "CLOSED", LOG_TEMPLATES.BarrierReport[5], "BARRIER_CLOSED", `障碍工单 #${id} 已关闭`);
    }
    throw invalidReviewAction();
  }
};

function applyReview(
  id: number,
  verifyStatus: BarrierReport["verify_status"],
  logTemplate: string,
  eventType: string,
  eventMessage: string
): BarrierReviewResult {
  const report = barrierReportRepository.update(id, { verify_status: verifyStatus });
  if (!report) {
    throw new ServiceError(404, ERROR_CODES.BARRIER_REPORT_NOT_FOUND, ERROR_MESSAGES.BARRIER_REPORT_NOT_FOUND);
  }
  console.info(logTemplate, toAuditTarget("BarrierReport", id), "->", verifyStatus);
  const routeUpdates = routePlanService.recomputeRiskForFacility(report.facility_id);
  for (const update of routeUpdates) {
    flowEventRepository.append({ route_id: update.route_id, event_type: eventType, message: eventMessage });
  }
  return { report, changed: true, route_updates: routeUpdates };
}
