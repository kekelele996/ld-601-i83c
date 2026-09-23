export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  REPORT_NOT_FOUND: "障碍工单不存在",
  ROUTE_NOT_FOUND: "路线不存在",
  REQUEST_NOT_FOUND: "协助请求不存在",
  INVALID_REVIEW_ACTION: "审核动作仅支持核实或关闭",
  ROUTE_HAS_OPEN_BARRIER: "关联路线仍存在未关闭的高优先级障碍，障碍尚未关闭，暂时无法接单",
  REQUEST_NOT_ACCEPTABLE: "仅待接单的协助请求可以接单"
};
