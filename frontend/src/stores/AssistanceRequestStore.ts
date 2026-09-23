import { create } from "zustand";
import { listAssistanceRequest, acceptAssistanceRequest } from "../api/AssistanceRequest";
import type { AssistanceRequest } from "../types/AssistanceRequest";

type State = {
  rows: AssistanceRequest[];
  loading: boolean;
  accepting: boolean;
  lastError: string | null;
  load: () => Promise<void>;
  accept: (id: number, helperId: number) => Promise<boolean>;
  clearError: () => void;
};

export const useAssistanceRequestStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  accepting: false,
  lastError: null,
  async load() {
    set({ loading: true });
    set({ rows: await listAssistanceRequest(), loading: false });
  },
  async accept(id, helperId) {
    set({ accepting: true, lastError: null });
    try {
      await acceptAssistanceRequest(id, helperId);
      await get().load();
      return true;
    } catch (err) {
      // 接单被拒（障碍未关闭等）时保留错误信息供页面展示。
      set({ lastError: err instanceof Error ? err.message : String(err) });
      return false;
    } finally {
      set({ accepting: false });
    }
  },
  clearError() {
    set({ lastError: null });
  }
}));
