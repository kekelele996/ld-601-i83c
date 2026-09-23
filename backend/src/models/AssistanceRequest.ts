import type { AssistanceStatus } from "../constants/AssistanceStatus";

export interface AssistanceRequest { id: number; user_id: number; route_plan_id: number; helper_id: number; request_time: string; status: AssistanceStatus; meet_point: string; contact_note: string }
