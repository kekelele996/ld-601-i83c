import { useAssistanceFlow } from "../hooks/useAssistanceFlow";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { formatRisk } from "../utils/formatters";

export function AssistancePage() {
  const { requests, feedback, accept, routeOf } = useAssistanceFlow();

  if (requests.length === 0) return <EmptyState title="暂无协助请求" />;

  return (
    <section>
      <h2>协助调度</h2>
      <p>路线存在未关闭的高优先级障碍时，待接单请求保留，但调度员接单会被拒绝。</p>
      <div className="table">
        {requests.map((request) => {
          const route = routeOf(request.route_plan_id);
          return (
            <article key={request.id} className="row">
              <strong>#{request.id} 路线 {request.route_plan_id}</strong>
              <span>集合点 {request.meet_point}</span>
              {route && <StatusBadge value={route.risk_level} />}
              {route && <span>路线风险：{formatRisk(route.risk_level)}</span>}
              <StatusBadge value={request.status} />
              <span className="actions">
                {request.status === "REQUESTED" && (
                  <button className="action-btn" onClick={() => void accept(request.id)}>
                    接单
                  </button>
                )}
              </span>
              {feedback[request.id] && <span className="feedback">{feedback[request.id]}</span>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
