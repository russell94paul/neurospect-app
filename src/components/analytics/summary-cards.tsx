import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSummary } from '@/hooks/use-analytics';
import { SETUP_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function SummaryCards() {
  const { data, isLoading } = useSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data || data.closed_trades === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <p className="text-sm">No closed trades yet</p>
      </div>
    );
  }

  const winRatePct = data.win_rate != null ? (data.win_rate * 100).toFixed(1) : '—';
  const winRatePositive = data.win_rate != null && data.win_rate >= 0.5;
  const avgR = data.avg_r_multiple != null ? data.avg_r_multiple.toFixed(2) : '—';
  const bestSetup =
    data.best_setup_type != null
      ? (SETUP_TYPE_LABELS as Record<string, string>)[data.best_setup_type] ??
        data.best_setup_type
      : '—';
  const currentStreak =
    data.current_win_streak > 0
      ? `${data.current_win_streak}W`
      : data.current_loss_streak > 0
        ? `${data.current_loss_streak}L`
        : '0';

  const cards: { title: string; value: string; valueClass?: string }[] = [
    { title: 'Total Trades', value: String(data.total_trades) },
    {
      title: 'Win Rate',
      value: `${winRatePct}%`,
      valueClass: winRatePositive ? 'text-green-500' : 'text-red-500',
    },
    { title: 'Avg R-Multiple', value: avgR },
    { title: 'Best Setup', value: bestSetup },
    {
      title: 'Current Streak',
      value: currentStreak,
      valueClass:
        data.current_win_streak > 0
          ? 'text-green-500'
          : data.current_loss_streak > 0
            ? 'text-red-500'
            : undefined,
    },
    { title: 'Longest Win Streak', value: `${data.longest_win_streak}W` },
    { title: 'Longest Loss Streak', value: `${data.longest_loss_streak}L` },
    { title: 'Closed Trades', value: String(data.closed_trades) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">{c.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className={cn('text-2xl font-semibold', c.valueClass)}>{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
