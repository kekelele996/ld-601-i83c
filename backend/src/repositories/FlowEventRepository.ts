import type { FlowEvent } from "../models/FlowEvent";

const events: FlowEvent[] = [];
let nextId = 1;

export const flowEventRepository = {
  append: (event: Pick<FlowEvent, "route_id" | "event_type" | "message">): FlowEvent => {
    const row: FlowEvent = { ...event, id: nextId++, created_at: new Date().toISOString() };
    events.push(row);
    return row;
  },
  findByRouteId: (routeId: number): FlowEvent[] => events.filter((event) => event.route_id === routeId),
  findAll: (): FlowEvent[] => events
};
