import type { AssistanceAcceptResult } from "../services/AssistanceRequestService";

export const createAssistanceRequestDto = (overrides = {}) => ({ id: 1, user_id: 1, route_plan_id: 1, helper_id: 0, request_time: "2026-06-11T09:00:00Z", status: "REQUESTED", meet_point: "meet point 1", contact_note: "contact note 1", ...overrides });

export const createAssistanceAcceptResultDto = (result: AssistanceAcceptResult) => ({
  request: result.request,
  changed: result.changed
});
