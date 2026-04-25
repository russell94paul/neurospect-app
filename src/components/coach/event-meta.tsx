import { formatDistanceToNow } from 'date-fns';
import { FreshnessPill } from './freshness-pill';
import type { CoachingEvent } from '@/types/api';

interface Props {
  event: CoachingEvent;
}

export function EventMeta({ event }: Props) {
  const relativeTime = formatDistanceToNow(new Date(event.created_at), { addSuffix: true });

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{event.instrument}</span>
      <span>·</span>
      <span>{relativeTime}</span>
      <span>·</span>
      <FreshnessPill createdAt={event.created_at} />
      {event.claude_latency_ms != null && (
        <>
          <span>·</span>
          <span>Claude {event.claude_latency_ms.toLocaleString()}ms</span>
        </>
      )}
    </div>
  );
}
