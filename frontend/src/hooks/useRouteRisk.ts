import { useEffect, useState } from "react";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import type { RoutePlan } from "../types/RoutePlan";
import type { BarrierReport } from "../types/BarrierReport";

export function useRouteRisk() {
  const { rows: routes, flow, load: loadRoutes, loadFlow } = useRoutePlanStore();
  const { rows: reports, load: loadReports } = useBarrierReportStore();
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  useEffect(() => {
    void loadRoutes();
    void loadReports();
  }, [loadRoutes, loadReports]);

  const openBarrierReportsFor = (route: RoutePlan): BarrierReport[] =>
    reports.filter(
      (report) =>
        route.facility_ids.includes(report.facility_id) &&
        report.priority === "HIGH" &&
        report.verify_status !== "CLOSED"
    );

  const selectRoute = (routeId: number) => {
    setSelectedRouteId(routeId);
    void loadFlow(routeId);
  };

  return { routes, reports, flow, selectedRouteId, selectRoute, openBarrierReportsFor };
}
