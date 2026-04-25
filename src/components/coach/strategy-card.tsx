import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STRATEGY_LABELS } from '@/lib/constants';
import type { ValidStrategy } from '@/types/api';
import { ChecklistRow } from './checklist-row';
import { ConfidencePill } from './confidence-pill';

interface Props {
  strategy: ValidStrategy;
}

export function StrategyCard({ strategy }: Props) {
  const name = STRATEGY_LABELS[strategy.strategy_id] ?? strategy.strategy_id;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{name}</CardTitle>
          <ConfidencePill confidence={strategy.confidence} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {strategy.checklist.length > 0 && (
          <div>
            {strategy.checklist.map((item) => (
              <ChecklistRow key={item.id} item={item} />
            ))}
          </div>
        )}

        {strategy.missing.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Missing
            </p>
            <ul className="space-y-0.5 text-sm text-muted-foreground">
              {strategy.missing.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {strategy.watch_for && (
          <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Watch for: </span>
            {strategy.watch_for}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
