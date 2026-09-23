import { seed } from "../seed";
import type { RoutePlan } from "../models/RoutePlan";
import type { RiskLevel } from "../constants/RiskLevel";

const rows: RoutePlan[] = seed.routePlan.map((row) => ({ ...row, facility_ids: [...row.facility_ids] }));

export const routePlanRepository = {
  findAll: (): RoutePlan[] => rows,
  findById: (id: number): RoutePlan | undefined => rows.find((row) => row.id === id),
  findByFacilityId: (facilityId: number): RoutePlan[] => rows.filter((row) => row.facility_ids.includes(facilityId)),
  updateRiskLevel: (id: number, riskLevel: RiskLevel): RoutePlan | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    row.risk_level = riskLevel;
    return row;
  },
  save: (row: unknown) => row
};
