import { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { StatusBadge } from "./components/common/StatusBadge";
import { DashboardPage } from "./pages/DashboardPage";
import { RoutesPage } from "./pages/RoutesPage";
import { AssistancePage } from "./pages/AssistancePage";
import { FacilitiesPage } from "./pages/FacilitiesPage";
import { ReportsPage } from "./pages/ReportsPage";
import "./styles.css";

const pageMap: Record<string, () => JSX.Element> = {
  "/dashboard": DashboardPage,
  "/routes": RoutesPage,
  "/assistance": AssistancePage,
  "/facilities": FacilitiesPage,
  "/reports": ReportsPage
};

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const current = routes.find((route) => route.route === active) ?? routes[0];
  const ActivePage = pageMap[current?.route ?? ""] ?? DashboardPage;
  return <div className="shell">
    <aside>
      <div className="brand">无障碍出行协助平台</div>
      <nav>{routes.map((route) => <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>{route.name}</button>)}</nav>
    </aside>
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">accessroute</p>
          <h1>{current?.name ?? "工作台"}</h1>
        </div>
        <StatusBadge value="LOCAL_DATA" />
      </section>
      <ActivePage />
    </main>
  </div>;
}

createRoot(document.getElementById("root")!).render(<App />);
