import { mockData } from "../mocks/seedData";
import type { AssistanceRequest } from "../types/AssistanceRequest";
import type { AssistanceAcceptResult } from "../types/RouteRiskFlow";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const endpoint = "/api/assistance-request";

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

export async function saveAssistanceRequest(payload: AssistanceRequest) {
  console.info("save AssistanceRequest", payload);
  return payload;
}

export async function acceptAssistanceRequest(id: number, helperId: number): Promise<AssistanceAcceptResult> {
  const res = await fetch(`${endpoint}/${id}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ helper_id: helperId })
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const code = body?.code as keyof typeof ERROR_MESSAGES | undefined;
    throw new Error((code && ERROR_MESSAGES[code]) ?? body?.message ?? ERROR_MESSAGES.VALIDATION_FAILED);
  }
  return body as AssistanceAcceptResult;
}
