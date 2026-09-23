export const BarrierVerifyStatus = ["PENDING", "VERIFIED", "CLOSED", "REJECTED"] as const;
export type BarrierVerifyStatus = (typeof BarrierVerifyStatus)[number];
