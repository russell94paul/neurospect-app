import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useRDistribution } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import type { RBucket } from '@/types/api';

function bucketColor(bucket: RBucket): string {
  const low = Number(bucket.r_low);
  const high = Number(bucket.r_high);
  if (low >= 0) return '#22c55e';
  if (high <= 0) return '#ef4444';
  return '#f59e0b';
}

export function RDistribution() {
  const { data, isLoading } = useRDistribution();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">No closed trades with R-multiples</p>
      </div>
    );
  }

  const chartData = data.map((b) => ({
    label: Number(b.r_low).toFixed(1),
    count: b.count,
    r_low: Number(b.r_low),
    r_high: Number(b.r_high),
    color: bucketColor(b),
  }));

  // Find the bucket closest to 0 for the reference line x position
  const zeroLabel = chartData.reduce((prev, curr) =>
    Math.abs(curr.r_low) < Math.abs(prev.r_low) ? curr : prev
  ).label;

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">R-Multiple Distribution</h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as (typeof chartData)[0];
                return (
                  <div className="rounded border bg-background p-2 text-xs shadow-md">
                    <p className="font-medium">
                      R: {d.r_low.toFixed(2)} to {d.r_high.toFixed(2)}
                    </p>
                    <p>Count: {d.count}</p>
                  </div>
                );
              }}
            />
            <ReferenceLine x={zeroLabel} stroke="#6b7280" strokeDasharray="4 4" />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
