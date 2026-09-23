import { StatusBadge } from "./StatusBadge";

export function RouteRiskPanel({ title = "RouteRiskPanel", value = "READY", detail }: { title?: string; value?: string; detail?: string }) {
  return <div className="shared-widget">
    <strong>{title}</strong>
    <StatusBadge value={value} />
    {detail ? <p className="muted">{detail}</p> : null}
  </div>;
}
