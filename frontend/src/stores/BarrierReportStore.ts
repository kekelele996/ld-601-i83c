import { create } from "zustand";
import { listBarrierReport, reviewBarrierReport } from "../api/BarrierReport";
import { useRoutePlanStore } from "./RoutePlanStore";
import type { BarrierReport } from "../types/BarrierReport";
import type { BarrierReviewResult } from "../types/RouteRiskFlow";

type State = {
  rows: BarrierReport[];
  loading: boolean;
  reviewing: boolean;
  lastError: string | null;
  load: () => Promise<void>;
  review: (id: number, action: "verify" | "close") => Promise<BarrierReviewResult | null>;
};

export const useBarrierReportStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  reviewing: false,
  lastError: null,
  async load() {
    set({ loading: true });
    set({ rows: await listBarrierReport(), loading: false });
  },
  async review(id, action) {
    set({ reviewing: true, lastError: null });
    try {
      const result = await reviewBarrierReport(id, action);
      await get().load();
      // 审核会影响关联路线风险，同步刷新路线与联动视图。
      const routePlanStore = useRoutePlanStore.getState();
      await routePlanStore.load();
      if (routePlanStore.riskFlow) await routePlanStore.loadRiskFlow(routePlanStore.riskFlow.route.id);
      return result;
    } catch (err) {
      set({ lastError: err instanceof Error ? err.message : String(err) });
      return null;
    } finally {
      set({ reviewing: false });
    }
  }
}));
