import type { RoutePlan } from "./RoutePlan";
import type { BarrierReport } from "./BarrierReport";
import type { AssistanceRequest } from "./AssistanceRequest";

export interface RouteRiskFlowBarrier extends BarrierReport {
  blocks_route: boolean;
}

export interface RouteRiskFlowRequest extends AssistanceRequest {
  accept_allowed: boolean;
  block_reason: string | null;
}

export interface RouteFlowEvent {
  id: number;
  route_id: number;
  event_type: string;
  message: string;
  created_at: string;
}

export interface RouteRiskFlow {
  route: RoutePlan;
  open_barriers: RouteRiskFlowBarrier[];
  barriers: RouteRiskFlowBarrier[];
  assistance_requests: RouteRiskFlowRequest[];
  events: RouteFlowEvent[];
}

export interface BarrierReviewResult {
  report: BarrierReport;
  changed: boolean;
  route_updates: { route_id: number; previous_risk_level: string; risk_level: string; changed: boolean }[];
}

export interface AssistanceAcceptResult {
  request: AssistanceRequest;
  changed: boolean;
}
