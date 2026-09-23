import { seed } from "../seed";
import type { RoutePlan } from "../models/RoutePlan";

const rows: RoutePlan[] = seed.routePlan.map((row) => ({ ...row, facility_ids: [...row.facility_ids] }));

export const routePlanRepository = {
  findAll: (): RoutePlan[] => rows,
  findById: (id: number): RoutePlan | undefined => rows.find((row) => row.id === id),
  findByFacilityId: (facilityId: number): RoutePlan[] => rows.filter((row) => row.facility_ids.includes(facilityId)),
  save: (row: unknown) => row,
  update: (id: number, patch: Partial<RoutePlan>): RoutePlan | undefined => {
    const index = rows.findIndex((row) => row.id === id);
    if (index < 0) return undefined;
    rows[index] = { ...rows[index], ...patch, id };
    return rows[index];
  }
};
