import type { FlowEventType } from "../constants/FlowEventType";

export interface FlowEvent { id: number; route_plan_id: number; event_type: FlowEventType; ref_type: string; ref_id: number; detail: string; created_at: string }
