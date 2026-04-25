import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { TradeForm } from '@/components/trade/trade-form';
import { useTrade } from '@/hooks/use-trades';
import { useScreenshots } from '@/hooks/use-screenshots';
import { ScreenshotGrid } from '@/components/screenshot/screenshot-grid';
import { ScreenshotUpload } from '@/components/screenshot/screenshot-upload';
import type { ScreenshotPhase } from '@/types/api';

const PHASE_SETS: Record<'pre_trade' | 'active' | 'closed', ScreenshotPhase[]> = {
  pre_trade: ['before_entry', 'higher_tf'],
  active: ['before_entry', 'entry', 'higher_tf'],
  closed: ['before_entry', 'entry', 'higher_tf', 'exit', 'post_trade_review'],
};

export function TradeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trade, isLoading, isError } = useTrade(id);
  const screenshotsQuery = useScreenshots(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !trade) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg font-medium">Trade not found.</p>
        <p className="text-sm text-muted-foreground">
          This trade may have been deleted or doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">
        {trade.instrument} · {trade.trade_date}
      </h1>

      <TradeForm trade={trade} />

      {/* Screenshots */}
      <div className="mt-8 space-y-6">
        <h2 className="text-lg font-semibold">Screenshots</h2>

        {/* Existing screenshots grouped by phase */}
        {screenshotsQuery.data && screenshotsQuery.data.length > 0 && (
          <ScreenshotGrid tradeId={trade.id} screenshots={screenshotsQuery.data} />
        )}

        {/* Upload zones for phases relevant to this trade's status */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PHASE_SETS[trade.status].map((phase) => (
            <ScreenshotUpload
              key={phase}
              tradeId={trade.id}
              phase={phase}
            />
          ))}
        </div>

        {screenshotsQuery.isError && (
          <p className="text-xs text-muted-foreground">
            Screenshot storage is not configured — uploads unavailable in local dev.
          </p>
        )}
      </div>
    </div>
  );
}
