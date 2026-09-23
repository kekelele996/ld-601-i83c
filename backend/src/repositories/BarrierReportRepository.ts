import { seed } from "../seed";
import type { BarrierReport } from "../models/BarrierReport";

const rows: BarrierReport[] = seed.barrierReport.map((row) => ({ ...row }));

export const barrierReportRepository = {
  findAll: (): BarrierReport[] => rows,
  findById: (id: number): BarrierReport | undefined => rows.find((row) => row.id === id),
  findOpenHighPriorityByFacilityIds: (facilityIds: number[]): BarrierReport[] =>
    rows.filter((row) => facilityIds.includes(row.facility_id) && row.priority === "HIGH" && row.verify_status !== "CLOSED"),
  update: (id: number, patch: Partial<BarrierReport>): BarrierReport | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  },
  save: (row: unknown) => row
};
