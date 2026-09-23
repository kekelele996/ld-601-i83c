import { mockData } from "../mocks/seedData";
import type { BarrierReport } from "../types/BarrierReport";
import type { RoutePlan } from "../types/RoutePlan";
import type { ReviewAction } from "../constants/ReviewAction";
import { toApiError } from "../utils/apiError";

const endpoint = "/api/barrier-report";

export interface BarrierReportReviewResult {
  report: BarrierReport;
  duplicated: boolean;
  affected_routes: Array<{ route: RoutePlan; changed: boolean; open_barrier_report_ids: number[] }>;
}

export async function listBarrierReport(): Promise<BarrierReport[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.barrierReport as unknown as BarrierReport[])];
}

export async function reviewBarrierReport(id: number, action: ReviewAction): Promise<BarrierReportReviewResult> {
  const res = await fetch(`${endpoint}/${id}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw toApiError(body);
  return body as BarrierReportReviewResult;
}

export async function saveBarrierReport(payload: BarrierReport) {
  console.info("save BarrierReport", payload);
  return payload;
}
