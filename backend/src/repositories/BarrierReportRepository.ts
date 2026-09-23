import { seed } from "../seed";
import type { BarrierReport } from "../models/BarrierReport";

const rows: BarrierReport[] = seed.barrierReport.map((row) => ({ ...row }));

export const barrierReportRepository = {
  findAll: (): BarrierReport[] => rows,
  findById: (id: number): BarrierReport | undefined => rows.find((row) => row.id === id),
  findByFacilityId: (facilityId: number): BarrierReport[] => rows.filter((row) => row.facility_id === facilityId),
  save: (row: unknown) => row,
  update: (id: number, patch: Partial<BarrierReport>): BarrierReport | undefined => {
    const index = rows.findIndex((row) => row.id === id);
    if (index < 0) return undefined;
    rows[index] = { ...rows[index], ...patch, id };
    return rows[index];
  }
};
