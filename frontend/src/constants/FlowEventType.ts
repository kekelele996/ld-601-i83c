export const FlowEventType = ["BARRIER_REVIEWED", "ROUTE_RISK_CHANGED", "ASSISTANCE_ACCEPTED", "ASSISTANCE_ACCEPT_REJECTED"] as const;
export type FlowEventType = (typeof FlowEventType)[number];
export const FlowEventTypeText: Record<FlowEventType, string> = {
  BARRIER_REVIEWED: "障碍审核",
  ROUTE_RISK_CHANGED: "路线风险变更",
  ASSISTANCE_ACCEPTED: "协助接单",
  ASSISTANCE_ACCEPT_REJECTED: "接单被拒"
};
