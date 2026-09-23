import { useEffect } from "react";
import { useRoutePlanStore } from "../stores/RoutePlanStore";

// 选中路线后加载「障碍审核 -> 路线风险 -> 协助接单」联动视图。
export function useRouteRisk(routeId: number | null) {
  const { riskFlow, riskFlowLoading, loadRiskFlow, clearRiskFlow } = useRoutePlanStore();

  useEffect(() => {
    if (routeId == null) {
      clearRiskFlow();
      return;
    }
    void loadRiskFlow(routeId);
  }, [routeId, loadRiskFlow, clearRiskFlow]);

  return {
    flow: routeId == null ? null : riskFlow,
    loading: riskFlowLoading,
    refresh: () => (routeId == null ? Promise.resolve() : loadRiskFlow(routeId))
  };
}
