import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { STRATEGY_LABELS } from '@/lib/constants';

interface Props {
  ids: string[];
}

export function InvalidStrategies({ ids }: Props) {
  const [open, setOpen] = useState(false);

  if (ids.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
          Invalid Strategies ({ids.length})
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-md border px-3 py-2">
        <ul className="space-y-1 text-sm text-muted-foreground">
          {ids.map((id) => (
            <li key={id} className="flex items-center gap-1.5">
              <span className="shrink-0">•</span>
              {STRATEGY_LABELS[id] ?? id}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
