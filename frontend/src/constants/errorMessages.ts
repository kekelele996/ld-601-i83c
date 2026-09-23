export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  BARRIER_REPORT_NOT_FOUND: "障碍工单不存在",
  ROUTE_PLAN_NOT_FOUND: "路线不存在",
  ASSISTANCE_REQUEST_NOT_FOUND: "协助请求不存在",
  INVALID_REVIEW_ACTION: "当前状态不允许该审核动作",
  ROUTE_BLOCKED_BY_BARRIER: "关联路线仍存在未关闭的高优先级障碍，暂时不能接单",
  ASSISTANCE_STATE_CONFLICT: "协助请求当前状态不允许接单"
};
