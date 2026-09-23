export const BarrierVerifyStatus = ["PENDING", "VERIFIED", "CLOSED", "REJECTED"] as const;
export type BarrierVerifyStatus = (typeof BarrierVerifyStatus)[number];
export const BarrierVerifyStatusText: Record<BarrierVerifyStatus, string> = {
  PENDING: "待审核",
  VERIFIED: "已核实",
  CLOSED: "已关闭",
  REJECTED: "已驳回"
};
