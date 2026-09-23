import { useEffect, useState } from "react";
import { useRoutePlanStore } from "../stores/RoutePlanStore";
import { useRouteRisk } from "../hooks/useRouteRisk";
import { StatusBadge } from "../components/common/StatusBadge";
import { RouteRiskPanel } from "../components/common/RouteRiskPanel";
import { TimelineList } from "../components/common/TimelineList";
import { EmptyState } from "../components/common/EmptyState";
import { BarrierVerifyStatusText } from "../constants/BarrierVerifyStatus";
import { BarrierPriorityText } from "../constants/BarrierPriority";
import type { BarrierVerifyStatus } from "../constants/BarrierVerifyStatus";
import type { BarrierPriority } from "../constants/BarrierPriority";
import { formatDate, formatRisk } from "../utils/formatters";

export function RoutesPage() {
  const { rows, loading, load } = useRoutePlanStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { flow, loading: flowLoading } = useRouteRisk(selectedId);

  useEffect(() => {
    void load();
  }, [load]);

  const openCount = flow?.open_barriers.length ?? 0;

  return <section className="workbench">
    <div className="panel wide">
      <h2>路线风险</h2>
      <p className="muted">选择一条路线，查询「障碍审核 → 路线风险 → 协助接单」的联动状态。</p>
      {loading ? <p className="muted">加载中…</p> : null}
      {!loading && rows.length === 0 ? <EmptyState title="暂无路线" /> : null}
      <div className="table">
        {rows.map((row) => (
          <article key={row.id} className={"row clickable" + (selectedId === row.id ? " selected" : "")} onClick={() => setSelectedId(row.id)}>
            <strong>#{row.id} {row.origin_text} → {row.destination_text}</strong>
            <span>风险{formatRisk(row.risk_level)}</span>
            <StatusBadge value={row.risk_level} />
          </article>
        ))}
      </div>
    </div>
    <div className="panel">
      <h2>联动流程</h2>
      {selectedId == null ? <EmptyState title="请选择路线" /> : null}
      {selectedId != null && flowLoading ? <p className="muted">查询中…</p> : null}
      {selectedId != null && !flowLoading && flow ? (
        <div className="flow-detail">
          <RouteRiskPanel
            title={`路线 #${flow.route.id} 当前风险`}
            value={flow.route.risk_level}
            detail={openCount > 0 ? `存在 ${openCount} 个未关闭的高优先级障碍，协助接单暂停。` : "无未关闭的高优先级障碍，协助请求可正常接单。"}
          />
          <h3>关联障碍工单</h3>
          {flow.barriers.length === 0 ? <p className="muted">该路线设施暂无障碍工单。</p> : (
            <div className="table">
              {flow.barriers.map((barrier) => (
                <article key={barrier.id} className="row">
                  <strong>#{barrier.id} {barrier.barrier_type}</strong>
                  <span>
                    {BarrierVerifyStatusText[barrier.verify_status as BarrierVerifyStatus] ?? barrier.verify_status}
                    {" · 优先级 "}
                    {BarrierPriorityText[barrier.priority as BarrierPriority] ?? barrier.priority}
                  </span>
                  <StatusBadge value={barrier.blocks_route ? "BLOCKING" : "OK"} />
                </article>
              ))}
            </div>
          )}
          <h3>协助请求</h3>
          {flow.assistance_requests.length === 0 ? <p className="muted">该路线暂无协助请求。</p> : (
            <div className="table">
              {flow.assistance_requests.map((request) => (
                <article key={request.id} className="row">
                  <strong>请求 #{request.id}</strong>
                  <span>{request.block_reason ?? (request.accept_allowed ? "可接单" : "—")}</span>
                  <StatusBadge value={request.status} />
                </article>
              ))}
            </div>
          )}
          <TimelineList
            title="流转记录"
            items={flow.events.map((event) => ({ id: event.id, text: event.message, time: formatDate(event.created_at) }))}
          />
        </div>
      ) : null}
    </div>
  </section>;
}
