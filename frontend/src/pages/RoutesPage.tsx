import { useRouteRisk } from "../hooks/useRouteRisk";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { TimelineList } from "../components/common/TimelineList";
import { EmptyState } from "../components/common/EmptyState";
import { formatOpenBarrier } from "../utils/formatters";

export function RoutesPage() {
  const { routes, flow, selectedRouteId, selectRoute, openBarrierReportsFor } = useRouteRisk();

  if (routes.length === 0) return <EmptyState title="暂无路线" />;

  return (
    <section>
      <h2>路线规划与风险</h2>
      <p>路线存在未关闭的高优先级障碍时保持高风险，障碍关闭后自动恢复低风险。</p>
      <div className="table">
        {routes.map((route) => {
          const openReports = openBarrierReportsFor(route);
          return (
            <article key={route.id} className="row">
              <strong>
                #{route.id} {route.origin_text} → {route.destination_text}
              </strong>
              <RouteRiskPanel title={`路线 ${route.id}`} riskLevel={route.risk_level} openBarrierCount={openReports.length} />
              <button className="action-btn" onClick={() => selectRoute(route.id)}>
                查看流程
              </button>
            </article>
          );
        })}
      </div>
      {selectedRouteId !== null && flow && (
        <section>
          <h3>路线 #{selectedRouteId} 联动流程</h3>
          <p>
            {flow.open_barrier_reports.length > 0
              ? `${formatOpenBarrier(flow.open_barrier_reports.length)}（${flow.open_barrier_reports
                  .map((report) => `#${report.id}`)
                  .join("、")}），协助接单将被拒绝。`
              : "当前无未关闭障碍，协助请求可正常接单。"}
          </p>
          <TimelineList title="障碍审核 → 路线风险 → 协助接单" events={flow.events} />
        </section>
      )}
    </section>
  );
}
