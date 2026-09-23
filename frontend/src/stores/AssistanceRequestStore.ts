import { create } from "zustand";
import { listAssistanceRequest, acceptAssistanceRequest } from "../api/AssistanceRequest";
import type { AssistanceRequest } from "../types/AssistanceRequest";

type State = {
  rows: AssistanceRequest[];
  loading: boolean;
  feedback: Record<number, string>;
  load: () => Promise<void>;
  accept: (id: number) => Promise<void>;
};

export const useAssistanceRequestStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  feedback: {},
  async load() {
    set({ loading: true });
    set({ rows: await listAssistanceRequest(), loading: false });
  },
  async accept(id) {
    try {
      const result = await acceptAssistanceRequest(id);
      set({
        feedback: {
          ...get().feedback,
          [id]: result.duplicated ? "重复提交：该请求已接单，未重复变更" : "接单成功"
        }
      });
    } catch (err) {
      set({ feedback: { ...get().feedback, [id]: (err as Error).message } });
    }
    await get().load();
  }
}));
