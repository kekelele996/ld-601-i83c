import type { BarrierReviewResult } from "../services/BarrierReportService";

export const createBarrierReportDto = (overrides = {}) => ({ id: 1, reporter_id: 1, facility_id: 1, barrier_type: "ELEVATOR_OUT_OF_SERVICE", description: "description 1", photo_url: "/mock/photo_url-1.png", verify_status: "PENDING", priority: "HIGH", ...overrides });

export const createBarrierReviewResultDto = (result: BarrierReviewResult) => ({
  report: result.report,
  changed: result.changed,
  route_updates: result.route_updates
});
