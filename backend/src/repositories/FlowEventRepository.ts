import type { FlowEvent } from "../models/FlowEvent";

const events: FlowEvent[] = [];
let nextId = 1;

export const flowEventRepository = {
  findAll: (): FlowEvent[] => events,
  findByRoutePlanId: (routePlanId: number): FlowEvent[] => events.filter((event) => event.route_plan_id === routePlanId),
  append: (event: Omit<FlowEvent, "id" | "created_at">): FlowEvent => {
    const row: FlowEvent = { ...event, id: nextId++, created_at: new Date().toISOString() };
    events.push(row);
    return row;
  }
};
