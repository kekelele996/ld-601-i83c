export const VerifyStatus = ["PENDING", "VERIFIED", "CLOSED"] as const;
export type VerifyStatus = (typeof VerifyStatus)[number];
