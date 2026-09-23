export const VerifyStatus = ["PENDING", "VERIFIED", "CLOSED"] as const;
export type VerifyStatus = (typeof VerifyStatus)[number];
export const VerifyStatusText: Record<VerifyStatus, string> = {
  PENDING: "待核实",
  VERIFIED: "已核实",
  CLOSED: "已关闭"
};
