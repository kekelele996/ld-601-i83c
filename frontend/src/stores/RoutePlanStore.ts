import { create } from "zustand";
import { listRoutePlan, getRoutePlanFlow, type RoutePlanFlow } from "../api/RoutePlan";
import type { RoutePlan } from "../types/RoutePlan";

type State = {
  rows: RoutePlan[];
  loading: boolean;
  flow: RoutePlanFlow | null;
  load: () => Promise<void>;
  loadFlow: (id: number) => Promise<void>;
};

export const useRoutePlanStore = create<State>((set) => ({
  rows: [],
  loading: false,
  flow: null,
  async load() {
    set({ loading: true });
    set({ rows: await listRoutePlan(), loading: false });
  },
  async loadFlow(id) {
    set({ flow: await getRoutePlanFlow(id) });
  }
}));
