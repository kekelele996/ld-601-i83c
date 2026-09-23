import { mockData } from "../mocks/seedData";
import type { BarrierReport } from "../types/BarrierReport";
import type { BarrierReviewResult } from "../types/RouteRiskFlow";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const endpoint = "/api/barrier-report";

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

export async function saveBarrierReport(payload: BarrierReport) {
  console.info("save BarrierReport", payload);
  return payload;
}

export async function reviewBarrierReport(id: number, action: "verify" | "close"): Promise<BarrierReviewResult> {
  const res = await fetch(`${endpoint}/${id}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action })
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const code = body?.code as keyof typeof ERROR_MESSAGES | undefined;
    throw new Error((code && ERROR_MESSAGES[code]) ?? body?.message ?? ERROR_MESSAGES.VALIDATION_FAILED);
  }
  return body as BarrierReviewResult;
}
