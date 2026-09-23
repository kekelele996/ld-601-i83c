import { useEffect } from "react";
import { useAccessibleFacilityStore } from "../stores/AccessibleFacilityStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";

export function FacilitiesPage() {
  const { rows, loading, load } = useAccessibleFacilityStore();

  useEffect(() => {
    void load();
  }, [load]);

  if (!loading && rows.length === 0) return <EmptyState title="暂无设施" />;

  return (
    <section>
      <h2>设施巡检</h2>
      <div className="table">
        {rows.map((facility) => (
          <article key={facility.id} className="row">
            <strong>
              #{facility.id} {facility.name}
            </strong>
            <span>{facility.floor}</span>
            <StatusBadge value={facility.status} />
          </article>
        ))}
      </div>
    </section>
  );
}
