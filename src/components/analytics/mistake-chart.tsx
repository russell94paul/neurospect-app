import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMistakes } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

function formatTag(tag: string) {
  return tag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MistakeChart() {
  const { data, isLoading } = useMistakes();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <p className="text-sm text-muted-foreground">No mistake tags recorded</p>
      </div>
    );
  }

  const chartData = [...data]
    .sort((a, b) => b.count - a.count)
    .map((row) => ({ tag: formatTag(row.tag), count: row.count }));

  const barHeight = 32;
  const chartHeight = Math.max(160, chartData.length * barHeight + 40);

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Mistakes by Frequency</h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="tag"
              width={120}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                return (
                  <div className="rounded border bg-background p-2 text-xs shadow-md">
                    <p className="font-medium">{payload[0].payload.tag}</p>
                    <p>Count: {payload[0].value}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
