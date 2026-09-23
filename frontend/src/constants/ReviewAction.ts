export const ReviewAction = ["VERIFY", "CLOSE"] as const;
export type ReviewAction = (typeof ReviewAction)[number];
export const ReviewActionText: Record<ReviewAction, string> = {
  VERIFY: "核实",
  CLOSE: "关闭"
};
