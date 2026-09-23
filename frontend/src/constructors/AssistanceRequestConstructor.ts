import type { AssistanceRequest } from "../types/AssistanceRequest";

export const createDefaultAssistanceRequest = (overrides: Partial<AssistanceRequest> = {}): AssistanceRequest => ({
  id: 1,
  user_id: 1,
  route_plan_id: 1,
  helper_id: 1,
  request_time: "2026-06-11T09:00:00Z",
  status: "REQUESTED",
  meet_point: "meet point 1",
  contact_note: "contact note 1",
  ...overrides
});

export const createAssistanceRequestForm = createDefaultAssistanceRequest;
export const createAssistanceRequestResponse = createDefaultAssistanceRequest;
