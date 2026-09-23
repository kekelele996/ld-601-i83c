export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  REPORT_NOT_FOUND: "barrier report not found",
  ROUTE_NOT_FOUND: "route plan not found",
  REQUEST_NOT_FOUND: "assistance request not found",
  INVALID_REVIEW_ACTION: "review action must be VERIFY or CLOSE",
  ROUTE_HAS_OPEN_BARRIER: "route still has unclosed high-priority barrier reports; the barrier is not closed yet, so the assistance request cannot be accepted",
  REQUEST_NOT_ACCEPTABLE: "only REQUESTED assistance requests can be accepted"
};
