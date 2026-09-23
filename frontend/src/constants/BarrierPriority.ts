export const BarrierPriority = ["HIGH", "MEDIUM", "LOW"] as const;
export type BarrierPriority = (typeof BarrierPriority)[number];
export const BarrierPriorityText: Record<BarrierPriority, string> = {
  HIGH: "高",
  MEDIUM: "中",
  LOW: "低"
};
