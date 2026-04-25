import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem } from '@/types/api';

function toTitleCase(id: string) {
  return id
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  item: ChecklistItem;
}

export function ChecklistRow({ item }: Props) {
  return (
    <div className="flex items-start gap-2 py-1">
      {item.met ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <Circle className={cn('mt-0.5 h-4 w-4 shrink-0 text-muted-foreground')} />
      )}
      <span className="text-sm">
        <span className={item.met ? 'text-foreground' : 'text-muted-foreground'}>
          {toTitleCase(item.id)}
        </span>
        {item.note && (
          <span className="text-muted-foreground"> — {item.note}</span>
        )}
      </span>
    </div>
  );
}
