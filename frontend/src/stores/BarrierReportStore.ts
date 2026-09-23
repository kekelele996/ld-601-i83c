import { create } from "zustand";
import { listBarrierReport, reviewBarrierReport } from "../api/BarrierReport";
import { useRoutePlanStore } from "./RoutePlanStore";
import type { BarrierReport } from "../types/BarrierReport";
import type { ReviewAction } from "../constants/ReviewAction";

type State = {
  rows: BarrierReport[];
  loading: boolean;
  lastResult: string | null;
  load: () => Promise<void>;
  review: (id: number, action: ReviewAction) => Promise<void>;
};

export const useBarrierReportStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  lastResult: null,
  async load() {
    set({ loading: true });
    set({ rows: await listBarrierReport(), loading: false });
  },
  async review(id, action) {
    try {
      const result = await reviewBarrierReport(id, action);
      const changedCount = result.affected_routes.filter((item) => item.changed).length;
      set({
        lastResult: result.duplicated
          ? "重复提交：该工单已处理过，路线风险未重复变更"
          : `处理完成，${changedCount} 条关联路线风险已更新`
      });
    } catch (err) {
      set({ lastResult: (err as Error).message });
    }
    await get().load();
    await useRoutePlanStore.getState().load();
  }
}));
