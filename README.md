# 无障碍出行协助平台

面向视障、轮椅和行动不便人群的室内外无障碍路线协助系统，聚合站点、设施、路线、志愿协助与障碍上报流程。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20101>

后端健康检查：<http://localhost:21101/health>


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
- BarrierVerifyStatus（PENDING/VERIFIED/CLOSED/REJECTED）: 前后端 constants/BarrierVerifyStatus、statusText、models/BarrierReport、BarrierReportService、ReportsPage。
- BarrierPriority（HIGH/MEDIUM/LOW）: 前后端 constants/BarrierPriority、statusText、models/BarrierReport、RoutePlanService（仅高优先级阻断路线）、ReportsPage、RoutesPage。
- RouteRiskLevel（LOW/MEDIUM/HIGH）: backend constants/RouteRiskLevel、models/RoutePlan、RoutePlanService、utils/formatters 的 formatRisk、RoutesPage。

## 障碍审核 → 路线风险 → 协助接单联动

- `POST /api/barrier-report/:id/review`，body `{"action":"verify"|"close"}`：巡检员核实/关闭障碍后，关联路线（facility_ids 命中）风险立即重算；存在未关闭的高优先级已核实障碍时路线为 HIGH，否则恢复 LOW。重复提交同一处理结果返回 `changed:false`，不重复影响路线。
- `POST /api/assistance-request/:id/accept`，body `{"helper_id":2}`：路线存在未关闭高优先级障碍时返回 `409 ROUTE_BLOCKED_BY_BARRIER`，待接单请求保留；同一调度员重复接单幂等返回现状。
- `GET /api/route-plan/:id/risk-flow`：查询某条路线的联动视图——关联障碍工单、未关闭阻断项、协助请求接单可行性与完整流转事件。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
