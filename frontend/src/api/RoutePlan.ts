import { mockData } from "../mocks/seedData";
import type { RoutePlan } from "../types/RoutePlan";
import type { RouteRiskFlow } from "../types/RouteRiskFlow";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const endpoint = "/api/route-plan";

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

export async function saveRoutePlan(payload: RoutePlan) {
  console.info("save RoutePlan", payload);
  return payload;
}

export async function getRouteRiskFlow(id: number): Promise<RouteRiskFlow> {
  const res = await fetch(`${endpoint}/${id}/risk-flow`);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const code = body?.code as keyof typeof ERROR_MESSAGES | undefined;
    throw new Error((code && ERROR_MESSAGES[code]) ?? body?.message ?? ERROR_MESSAGES.ROUTE_PLAN_NOT_FOUND);
  }
  return body as RouteRiskFlow;
}
