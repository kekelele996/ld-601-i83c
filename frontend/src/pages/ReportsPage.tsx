import { useEffect } from "react";
import { useBarrierReportStore } from "../stores/BarrierReportStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { VerifyStatusText } from "../constants/VerifyStatus";
import { BarrierPriorityText } from "../constants/BarrierPriority";
import { ReviewActionText } from "../constants/ReviewAction";

export function ReportsPage() {
  const { rows, loading, lastResult, load, review } = useBarrierReportStore();

  useEffect(() => {
    void load();
  }, [load]);

  if (!loading && rows.length === 0) return <EmptyState title="暂无障碍工单" />;

  return (
    <section>
      <h2>障碍工单审核</h2>
      <p>巡检员核实或关闭障碍后，关联路线风险会立即重算；重复提交处理结果不会重复影响路线。</p>
      {lastResult && <p className="feedback">{lastResult}</p>}
      <div className="table">
        {rows.map((report) => (
          <article key={report.id} className="row">
            <strong>#{report.id} 设施 {report.facility_id}</strong>
            <span>{report.description}</span>
            <StatusBadge value={report.priority} />
            <span>{BarrierPriorityText[report.priority]}优先级</span>
            <StatusBadge value={report.verify_status} />
            <span>{VerifyStatusText[report.verify_status]}</span>
            <span className="actions">
              {report.verify_status === "PENDING" && (
                <button className="action-btn" onClick={() => void review(report.id, "VERIFY")}>
                  {ReviewActionText.VERIFY}
                </button>
              )}
              {report.verify_status !== "CLOSED" && (
                <button className="action-btn" onClick={() => void review(report.id, "CLOSE")}>
                  {ReviewActionText.CLOSE}
                </button>
              )}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
