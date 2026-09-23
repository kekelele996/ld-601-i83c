export const BarrierPriority = ["HIGH", "MEDIUM", "LOW"] as const;
export type BarrierPriority = (typeof BarrierPriority)[number];
