import { useRouteRisk } from "../hooks/useRouteRisk";
import { StatCard } from "../components/common/StatCard";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { EmptyState } from "../components/common/EmptyState";

export function DashboardPage() {
  const { routes, reports, openBarrierReportsFor } = useRouteRisk();
  const highRiskRoutes = routes.filter((route) => route.risk_level === "HIGH");
  const openHighReports = reports.filter((report) => report.priority === "HIGH" && report.verify_status !== "CLOSED");

  return (
    <section>
      <div className="metrics">
        <StatCard label="路线总数" value={routes.length} />
        <StatCard label="高风险路线" value={highRiskRoutes.length} />
        <StatCard label="未关闭高优先级障碍" value={openHighReports.length} />
      </div>
      <h2>风险路线</h2>
      {highRiskRoutes.length === 0 ? (
        <EmptyState title="当前没有高风险路线" />
      ) : (
        highRiskRoutes.map((route) => (
          <RouteRiskPanel
            key={route.id}
            title={`#${route.id} ${route.origin_text} → ${route.destination_text}`}
            riskLevel={route.risk_level}
            openBarrierCount={openBarrierReportsFor(route).length}
          />
        ))
      )}
    </section>
  );
}
