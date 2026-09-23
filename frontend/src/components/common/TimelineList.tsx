import { StatusBadge } from "./StatusBadge";
import { FlowEventTypeText } from "../../constants/FlowEventType";
import { formatDate } from "../../utils/formatters";
import type { FlowEvent } from "../../types/FlowEvent";

export function TimelineList({ title = "流程时间线", events = [] }: { title?: string; events?: FlowEvent[] }) {
  return (
    <div className="shared-widget">
      <strong>{title}</strong>
      {events.length === 0 ? (
        <p>暂无流程事件</p>
      ) : (
        <ul className="timeline">
          {events.map((event) => (
            <li key={event.id}>
              <StatusBadge value={event.event_type} />
              <span>{FlowEventTypeText[event.event_type as keyof typeof FlowEventTypeText] ?? event.event_type}</span>
              <span>{event.detail}</span>
              <time>{formatDate(event.created_at)}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
