import { StatusBadge } from "./StatusBadge";
import { formatRisk, formatOpenBarrier } from "../../utils/formatters";

export function RouteRiskPanel({ title, riskLevel, openBarrierCount = 0 }: { title: string; riskLevel: string; openBarrierCount?: number }) {
  return (
    <div className="shared-widget">
      <strong>{title}</strong>
      <StatusBadge value={riskLevel} />
      <span>风险等级：{formatRisk(riskLevel)}</span>
      <span>{formatOpenBarrier(openBarrierCount)}</span>
    </div>
  );
}
