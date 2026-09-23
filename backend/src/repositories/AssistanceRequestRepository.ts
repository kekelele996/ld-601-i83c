import { seed } from "../seed";
import type { AssistanceRequest } from "../models/AssistanceRequest";

const rows: AssistanceRequest[] = seed.assistanceRequest.map((row) => ({ ...row }));

export const assistanceRequestRepository = {
  findAll: (): AssistanceRequest[] => rows,
  findById: (id: number): AssistanceRequest | undefined => rows.find((row) => row.id === id),
  update: (id: number, patch: Partial<AssistanceRequest>): AssistanceRequest | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  },
  save: (row: unknown) => row
};
