import type { VerifyStatus } from "./VerifyStatus";

export const ReviewAction = ["VERIFY", "CLOSE"] as const;
export type ReviewAction = (typeof ReviewAction)[number];

export const REVIEW_TARGET_STATUS: Record<ReviewAction, VerifyStatus> = {
  VERIFY: "VERIFIED",
  CLOSE: "CLOSED"
};
