export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  BARRIER_REPORT_NOT_FOUND: "barrier report not found",
  ROUTE_PLAN_NOT_FOUND: "route plan not found",
  ASSISTANCE_REQUEST_NOT_FOUND: "assistance request not found",
  INVALID_REVIEW_ACTION: "review action not allowed for current verify_status",
  ROUTE_BLOCKED_BY_BARRIER: "route still has unclosed high priority barrier, accept rejected",
  ASSISTANCE_STATE_CONFLICT: "assistance request status does not allow accept"
};
