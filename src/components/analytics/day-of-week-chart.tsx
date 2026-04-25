import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useByDayOfWeek } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

export function DayOfWeekChart() {
  const { data, isLoading } = useByDayOfWeek();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">No data</p>
      </div>
    );
  }

  const chartData = data.map((row) => ({
    day: row.day_name,
    win_rate: row.win_rate != null ? +(row.win_rate * 100).toFixed(1) : 0,
    total: row.total,
    wins: row.wins,
    losses: row.losses,
    avg_r: row.avg_r_multiple,
  }));

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Win Rate by Day of Week</h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as (typeof chartData)[0];
                return (
                  <div className="rounded border bg-background p-2 text-xs shadow-md">
                    <p className="font-medium">{d.day}</p>
                    <p>Win Rate: {d.win_rate}%</p>
                    <p>
                      Trades: {d.total} ({d.wins}W / {d.losses}L)
                    </p>
                    {d.avg_r != null && <p>Avg R: {d.avg_r.toFixed(2)}</p>}
                  </div>
                );
              }}
            />
            <Bar dataKey="win_rate" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.win_rate >= 50 ? '#22c55e' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
