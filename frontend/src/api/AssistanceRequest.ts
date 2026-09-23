import { mockData } from "../mocks/seedData";
import type { AssistanceRequest } from "../types/AssistanceRequest";
import { toApiError } from "../utils/apiError";

const endpoint = "/api/assistance-request";

export interface AssistanceAcceptResult {
  request: AssistanceRequest;
  duplicated: boolean;
}

export async function listAssistanceRequest(): Promise<AssistanceRequest[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.assistanceRequest as unknown as AssistanceRequest[])];
}

export async function acceptAssistanceRequest(id: number): Promise<AssistanceAcceptResult> {
  const res = await fetch(`${endpoint}/${id}/accept`, { method: "POST" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw toApiError(body);
  return body as AssistanceAcceptResult;
}

export async function saveAssistanceRequest(payload: AssistanceRequest) {
  console.info("save AssistanceRequest", payload);
  return payload;
}
