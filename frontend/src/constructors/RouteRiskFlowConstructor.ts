import type { RouteRiskFlow } from "../types/RouteRiskFlow";
import { createDefaultRoutePlan } from "./RoutePlanConstructor";

export const createDefaultRouteRiskFlow = (overrides: Partial<RouteRiskFlow> = {}): RouteRiskFlow => ({
  route: createDefaultRoutePlan(),
  open_barriers: [],
  barriers: [],
  assistance_requests: [],
  events: [],
  ...overrides
});

export const createRouteRiskFlowResponse = createDefaultRouteRiskFlow;
