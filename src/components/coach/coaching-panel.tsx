import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLatestCoachingEvent } from '@/hooks/use-coaching';
import { useCreateTrade } from '@/hooks/use-trades';
import { buildTradeCreateFromEvent } from '@/lib/coach-prefill';
import type { Layer3Response } from '@/types/api';
import { AlertsBanner } from './alerts-banner';
import { BiasBadge } from './bias-badge';
import { EventMeta } from './event-meta';
import { InvalidStrategies } from './invalid-strategies';
import { StrategyCard } from './strategy-card';

export function CoachingPanel() {
  const { data, isLoading } = useLatestCoachingEvent();
  const coachNavState = data?.status === 'complete'
    ? { coachPrefilled: true, fieldNames: buildTradeCreateFromEvent(data).fieldNames }
    : undefined;
  const createTrade = useCreateTrade(coachNavState);

  if (isLoading && data === undefined) {
    return (
      <Card>
        <CardContent className="space-y-3 py-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data === null) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No coaching yet. Configure TradingView in{' '}
            <Link to="/coach/setup" className="text-primary underline underline-offset-2">
              Setup
            </Link>{' '}
            to receive coaching.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  if (data.status === 'pending') {
    return (
      <div className="space-y-4">
        <EventMeta event={data} />
        <Card>
          <CardContent className="space-y-3 py-6">
            <p className="animate-pulse text-sm font-medium text-muted-foreground">
              Claude is thinking…
            </p>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.status === 'error') {
    return (
      <div className="space-y-4">
        <EventMeta event={data} />
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <CardContent className="py-4">
            <p className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
              Coaching failed
            </p>
            {data.error_message && (
              <pre className="mb-3 overflow-auto whitespace-pre-wrap break-all rounded bg-red-100 px-3 py-2 font-mono text-xs text-red-800 dark:bg-red-900/40 dark:text-red-200">
                {data.error_message}
              </pre>
            )}
            <p className="text-xs text-muted-foreground">
              Fire another alert from TradingView to try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // status === 'complete'
  const payload = data.response_payload
    ? (data.response_payload as unknown as Layer3Response)
    : null;

  const coachResult = buildTradeCreateFromEvent(data);
  const handleStartTrade = () => {
    createTrade.mutate(coachResult.create);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <EventMeta event={data} />
        {payload && <BiasBadge bias={payload.bias} />}
        <Button
          size="sm"
          variant="outline"
          className="ml-auto gap-1.5"
          onClick={handleStartTrade}
          disabled={createTrade.isPending}
        >
          <PlusCircle className="h-4 w-4" />
          {createTrade.isPending ? 'Creating…' : 'Start Trade from Signal'}
        </Button>
      </div>

      {payload && (
        <>
          {payload.narrative && (
            <Card>
              <CardHeader className="pb-1 pt-4" />
              <CardContent className="pb-4 text-sm leading-relaxed">
                {payload.narrative}
              </CardContent>
            </Card>
          )}

          <AlertsBanner alerts={payload.alerts ?? []} />

          <div className="space-y-3">
            {payload.valid_strategies.map((s) => (
              <StrategyCard key={s.strategy_id} strategy={s} />
            ))}
          </div>

          <InvalidStrategies ids={payload.invalid_strategies ?? []} />
        </>
      )}
    </div>
  );
}
