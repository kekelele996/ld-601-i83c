import { useEffect } from "react";
import { useAssistanceFlow } from "../hooks/useAssistanceFlow";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";

const HELPER_ID = 2;

export function AssistancePage() {
  const { rows, loading, accepting, error, load, accept, clearError } = useAssistanceFlow(HELPER_ID);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAccept = async (id: number) => {
    clearError();
    await accept(id);
  };

  return <section className="panel wide">
    <h2>协助调度</h2>
    <p className="muted">路线存在未关闭的高优先级障碍时，待接单请求保留但接单会被拒绝。</p>
    {error ? <p className="error-text">接单被拒绝：{error}</p> : null}
    {loading ? <p className="muted">加载中…</p> : null}
    {!loading && rows.length === 0 ? <EmptyState title="暂无协助请求" /> : null}
    <div className="table">
      {rows.map((row) => (
        <article key={row.id} className="row">
          <strong>请求 #{row.id} · 路线 {row.route_plan_id}</strong>
          <span>{row.meet_point}</span>
          <span className="actions">
            <StatusBadge value={row.status} />
            {row.status === "REQUESTED" ? (
              <button className="primary" disabled={accepting} onClick={() => void handleAccept(row.id)}>接单</button>
            ) : null}
          </span>
        </article>
      ))}
    </div>
  </section>;
}
