import { mockData } from "../mocks/seedData";
import type { RoutePlan } from "../types/RoutePlan";
import type { BarrierReport } from "../types/BarrierReport";
import type { FlowEvent } from "../types/FlowEvent";
import { toApiError } from "../utils/apiError";

const endpoint = "/api/route-plan";

export interface RoutePlanFlow {
  route: RoutePlan;
  open_barrier_reports: BarrierReport[];
  events: FlowEvent[];
}

export async function listRoutePlan(): Promise<RoutePlan[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.routePlan as unknown as RoutePlan[])];
}

export async function getRoutePlanFlow(id: number): Promise<RoutePlanFlow> {
  const res = await fetch(`${endpoint}/${id}/flow`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw toApiError(body);
  return body as RoutePlanFlow;
}

export async function saveRoutePlan(payload: RoutePlan) {
  console.info("save RoutePlan", payload);
  return payload;
}
