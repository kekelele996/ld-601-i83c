export type BarrierReportPayload = Record<string, unknown>;

export interface BarrierReviewPayload {
  action?: "verify" | "close";
}
