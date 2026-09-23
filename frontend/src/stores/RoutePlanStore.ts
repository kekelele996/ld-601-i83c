import { create } from "zustand";
import { listRoutePlan, getRouteRiskFlow } from "../api/RoutePlan";
import type { RoutePlan } from "../types/RoutePlan";
import type { RouteRiskFlow } from "../types/RouteRiskFlow";

type State = {
  rows: RoutePlan[];
  loading: boolean;
  riskFlow: RouteRiskFlow | null;
  riskFlowLoading: boolean;
  load: () => Promise<void>;
  loadRiskFlow: (routeId: number) => Promise<void>;
  clearRiskFlow: () => void;
};

export const useRoutePlanStore = create<State>((set) => ({
  rows: [],
  loading: false,
  riskFlow: null,
  riskFlowLoading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listRoutePlan(), loading: false });
  },
  async loadRiskFlow(routeId) {
    set({ riskFlowLoading: true });
    try {
      set({ riskFlow: await getRouteRiskFlow(routeId), riskFlowLoading: false });
    } catch {
      set({ riskFlow: null, riskFlowLoading: false });
    }
  },
  clearRiskFlow() {
    set({ riskFlow: null });
  }
}));
