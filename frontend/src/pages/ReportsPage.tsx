import { useEffect, useState } from "react";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { BarrierVerifyStatusText } from "../constants/BarrierVerifyStatus";
import { BarrierPriorityText } from "../constants/BarrierPriority";
import type { BarrierVerifyStatus } from "../constants/BarrierVerifyStatus";
import type { BarrierPriority } from "../constants/BarrierPriority";
import { formatRisk } from "../utils/formatters";

export function ReportsPage() {
  const { rows, loading, reviewing, lastError, load, review } = useBarrierReportStore();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  const handleReview = async (id: number, action: "verify" | "close") => {
    setMessage(null);
    const result = await review(id, action);
    if (!result) return;
    if (!result.changed) {
      setMessage(`工单 #${id} 已处于该状态，重复提交未再次影响路线。`);
      return;
    }
    const changes = result.route_updates.filter((update) => update.changed);
    setMessage(
      changes.length === 0
        ? `工单 #${id} 处理完成，关联路线风险无变化。`
        : `工单 #${id} 处理完成：` +
            changes
              .map((update) => `路线 ${update.route_id} 风险 ${formatRisk(update.previous_risk_level)}→${formatRisk(update.risk_level)}`)
              .join("，")
    );
  };

  return <section className="panel wide">
    <h2>障碍工单审核</h2>
    <p className="muted">巡检员核实或关闭障碍后，关联路线风险立即重算；重复提交同一处理结果不会重复影响路线。</p>
    {lastError ? <p className="error-text">{lastError}</p> : null}
    {message ? <p className="notice-text">{message}</p> : null}
    {loading ? <p className="muted">加载中…</p> : null}
    {!loading && rows.length === 0 ? <EmptyState title="暂无障碍工单" /> : null}
    <div className="table">
      {rows.map((row) => (
        <article key={row.id} className="row">
          <strong>#{row.id} {row.barrier_type}</strong>
          <span>设施 {row.facility_id} · 优先级 {BarrierPriorityText[row.priority as BarrierPriority] ?? row.priority}</span>
          <span className="actions">
            <StatusBadge value={row.verify_status} />
            <span>{BarrierVerifyStatusText[row.verify_status as BarrierVerifyStatus] ?? row.verify_status}</span>
            {row.verify_status === "PENDING" ? (
              <button className="primary" disabled={reviewing} onClick={() => void handleReview(row.id, "verify")}>核实</button>
            ) : null}
            {row.verify_status === "VERIFIED" ? (
              <button className="primary" disabled={reviewing} onClick={() => void handleReview(row.id, "close")}>关闭</button>
            ) : null}
          </span>
        </article>
      ))}
    </div>
  </section>;
}
