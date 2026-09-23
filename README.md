# 无障碍出行协助平台

面向视障、轮椅和行动不便人群的室内外无障碍路线协助系统，聚合站点、设施、路线、志愿协助与障碍上报流程。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20101>

后端健康检查：<http://localhost:21101/health>

## 障碍审核 → 路线风险 → 协助接单联动流程

- 设施巡检员审核障碍工单：`POST /api/barrier-report/:id/review`，body `{"action":"VERIFY"}` 或 `{"action":"CLOSE"}`（大小写不敏感）。核实或关闭后，引用该设施的所有路线立即重算风险。
- 风险规则：路线任一设施上存在未关闭（`verify_status != CLOSED`）的高优先级（`priority = HIGH`）障碍时，路线为 `HIGH`；全部关闭后恢复 `LOW`。
- 协助接单：`POST /api/assistance-request/:id/accept`。路线高风险时待接单请求保留，但接单被拒绝并返回 `ROUTE_HAS_OPEN_BARRIER`（障碍尚未关闭）；障碍关闭后可正常接单。
- 流程查询：`GET /api/route-plan/:id/flow` 返回路线当前风险、未关闭障碍和完整事件链（障碍审核 → 路线风险变更 → 协助接单/接单被拒）。
- 幂等：重复提交相同审核结果或重复接单返回 `duplicated: true`，不会重复改变路线风险，也不会重复写入流程事件。


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Ant Design + Zustand |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `accessroute`
- `FRONTEND_PORT`: 前端端口，默认 `20101`
- `BACKEND_PORT`: 后端端口，默认 `21101`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: accessroute`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-accessroute}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- MobilityType: constants/MobilityType、types/MobilityType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- FacilityStatus: constants/FacilityStatus、types/FacilityStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- AssistanceStatus: constants/AssistanceStatus、types/AssistanceStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- VerifyStatus（PENDING/VERIFIED/CLOSED）: backend constants/VerifyStatus、frontend constants/VerifyStatus 与 types/VerifyStatus、BarrierReport 模型与 DTO、ReportsPage、statusText。
- BarrierPriority（HIGH/MEDIUM/LOW）: backend constants/BarrierPriority、frontend constants/BarrierPriority 与 types/BarrierPriority、BarrierReportRepository 风险查询、ReportsPage、statusText。
- RiskLevel（LOW/MEDIUM/HIGH）: backend constants/RiskLevel、RoutePlan 模型、RoutePlanService 重算逻辑、RouteRiskPanel、formatters.formatRisk。
- ReviewAction（VERIFY/CLOSE）: backend constants/ReviewAction（含 REVIEW_TARGET_STATUS 映射）、frontend constants/ReviewAction、BarrierReportService.review、ReportsPage 审核按钮。
- FlowEventType（BARRIER_REVIEWED/ROUTE_RISK_CHANGED/ASSISTANCE_ACCEPTED/ASSISTANCE_ACCEPT_REJECTED）: backend constants/FlowEventType、FlowEvent 模型与 FlowEventRepository、frontend constants/FlowEventType、TimelineList。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
