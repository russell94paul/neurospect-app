import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { BreakdownRow } from '@/types/api';
import { cn } from '@/lib/utils';

type SortKey = keyof BreakdownRow;
type SortDir = 'asc' | 'desc';

interface Props {
  title: string;
  rows: BreakdownRow[];
  labelMap?: Record<string, string>;
}

export function BreakdownTable({ title, rows, labelMap }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('total');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = (a[sortKey] as number | null) ?? 0;
    const bv = (b[sortKey] as number | null) ?? 0;
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function ColHeader({ label, colKey }: { label: string; colKey: SortKey }) {
    return (
      <th
        className="cursor-pointer select-none px-3 py-2 text-right text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={() => toggleSort(colKey)}
      >
        <span className="inline-flex items-center justify-end gap-1">
          {label}
          <ArrowUpDown className="h-3 w-3 shrink-0" />
        </span>
      </th>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">No data</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  Group
                </th>
                <ColHeader label="Total" colKey="total" />
                <ColHeader label="Wins" colKey="wins" />
                <ColHeader label="Losses" colKey="losses" />
                <ColHeader label="BE" colKey="breakevens" />
                <ColHeader label="Win %" colKey="win_rate" />
                <ColHeader label="Avg R" colKey="avg_r_multiple" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.group} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">
                    {labelMap?.[row.group] ?? row.group}
                  </td>
                  <td className="px-3 py-2 text-right">{row.total}</td>
                  <td className="px-3 py-2 text-right text-green-600">{row.wins}</td>
                  <td className="px-3 py-2 text-right text-red-500">{row.losses}</td>
                  <td className="px-3 py-2 text-right">{row.breakevens}</td>
                  <td
                    className={cn(
                      'px-3 py-2 text-right font-medium',
                      row.win_rate != null && row.win_rate >= 0.5
                        ? 'text-green-600'
                        : 'text-red-500'
                    )}
                  >
                    {row.win_rate != null ? `${(row.win_rate * 100).toFixed(1)}%` : '—'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.avg_r_multiple != null ? row.avg_r_multiple.toFixed(2) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
