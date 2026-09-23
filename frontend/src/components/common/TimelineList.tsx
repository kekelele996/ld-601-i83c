import { StatusBadge } from "./StatusBadge";

export interface TimelineItem {
  id: string | number;
  text: string;
  time?: string;
}

export function TimelineList({ title = "TimelineList", value = "READY", items }: { title?: string; value?: string; items?: TimelineItem[] }) {
  if (!items) {
    return <div className="shared-widget"><strong>{title}</strong><StatusBadge value={value} /></div>;
  }
  return <div className="shared-widget">
    <strong>{title}</strong>
    {items.length === 0 ? <p className="muted">暂无流转记录</p> : (
      <ul className="timeline">
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.text}</span>
            {item.time ? <time>{item.time}</time> : null}
          </li>
        ))}
      </ul>
    )}
  </div>;
}
