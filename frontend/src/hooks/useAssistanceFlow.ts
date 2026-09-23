import { useEffect } from "react";
import { useAssistanceRequestStore } from "../stores/AssistanceRequestStore";
import { useRoutePlanStore } from "../stores/RoutePlanStore";

export function useAssistanceFlow() {
  const { rows: requests, feedback, load, accept } = useAssistanceRequestStore();
  const { rows: routes, load: loadRoutes } = useRoutePlanStore();

  useEffect(() => {
    void load();
    void loadRoutes();
  }, [load, loadRoutes]);

  const routeOf = (routePlanId: number) => routes.find((route) => route.id === routePlanId);

  return { requests, feedback, accept, routeOf };
}
