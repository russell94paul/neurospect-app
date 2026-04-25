import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SummaryCards } from '@/components/analytics/summary-cards';
import { BreakdownTable } from '@/components/analytics/breakdown-table';
import { DayOfWeekChart } from '@/components/analytics/day-of-week-chart';
import { MistakeChart } from '@/components/analytics/mistake-chart';
import { RDistribution } from '@/components/analytics/r-distribution';
import { useBySetup, useBySession, useByInstrument, useSummary } from '@/hooks/use-analytics';
import { SETUP_TYPE_LABELS, SESSION_LABELS } from '@/lib/constants';

export function DashboardPage() {
  const summary = useSummary();
  const bySetup = useBySetup();
  const bySession = useBySession();
  const byInstrument = useByInstrument();

  const hasNoTrades =
    !summary.isLoading && summary.data != null && summary.data.total_trades === 0;

  if (hasNoTrades) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="max-w-sm text-center text-muted-foreground">
          Start journaling to see your analytics
        </p>
        <Button asChild>
          <Link to="/trades/new">Log Your First Trade</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BreakdownTable
          title="By Setup Type"
          rows={bySetup.data ?? []}
          labelMap={SETUP_TYPE_LABELS as Record<string, string>}
        />
        <BreakdownTable
          title="By Session"
          rows={bySession.data ?? []}
          labelMap={SESSION_LABELS as Record<string, string>}
        />
        <BreakdownTable title="By Instrument" rows={byInstrument.data ?? []} />
        <DayOfWeekChart />
        <MistakeChart />
        <RDistribution />
      </div>
    </div>
  );
}
