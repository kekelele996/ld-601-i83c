export const LOG_TEMPLATES = {
  UserProfile: ["UserProfile.create", "UserProfile.update", "UserProfile.status", "UserProfile.export"],
  AccessibleFacility: ["AccessibleFacility.create", "AccessibleFacility.update", "AccessibleFacility.status", "AccessibleFacility.export"],
  RoutePlan: ["RoutePlan.create", "RoutePlan.update", "RoutePlan.status", "RoutePlan.export", "RoutePlan.risk_recompute"],
  AssistanceRequest: ["AssistanceRequest.create", "AssistanceRequest.update", "AssistanceRequest.status", "AssistanceRequest.export", "AssistanceRequest.accept", "AssistanceRequest.accept_blocked"],
  BarrierReport: ["BarrierReport.create", "BarrierReport.update", "BarrierReport.status", "BarrierReport.export", "BarrierReport.verify", "BarrierReport.close"]
};
