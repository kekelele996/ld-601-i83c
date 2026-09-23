import { seed } from "../seed";
import type { AssistanceRequest } from "../models/AssistanceRequest";

const rows: AssistanceRequest[] = seed.assistanceRequest.map((row) => ({ ...row }));

export const assistanceRequestRepository = {
  findAll: (): AssistanceRequest[] => rows,
  findById: (id: number): AssistanceRequest | undefined => rows.find((row) => row.id === id),
  findByRoutePlanId: (routePlanId: number): AssistanceRequest[] => rows.filter((row) => row.route_plan_id === routePlanId),
  save: (row: unknown) => row,
  update: (id: number, patch: Partial<AssistanceRequest>): AssistanceRequest | undefined => {
    const index = rows.findIndex((row) => row.id === id);
    if (index < 0) return undefined;
    rows[index] = { ...rows[index], ...patch, id };
    return rows[index];
  }
};
