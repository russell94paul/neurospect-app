import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { SETUP_TYPE_LABELS, SESSION_LABELS } from '@/lib/constants';
import { formatDate, formatDecimal } from '@/lib/utils';
import type { Trade } from '@/types/api';
import { StatusBadge } from './status-badge';

interface Props {
  trade: Trade;
}

export function TradeCard({ trade }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/trades/${trade.id}`)}
    >
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {formatDate(trade.trade_date)}
            </span>
            <span className="font-semibold">{trade.instrument}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {trade.setup_type && (
              <span>{SETUP_TYPE_LABELS[trade.setup_type]}</span>
            )}
            {trade.session && (
              <>
                {trade.setup_type && <span>·</span>}
                <span>{SESSION_LABELS[trade.session]}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={trade.status} outcome={trade.outcome} />
          {trade.status === 'closed' && trade.r_multiple != null && (
            <span
              className={
                Number(trade.r_multiple) >= 0
                  ? 'text-sm font-medium text-green-700 dark:text-green-400'
                  : 'text-sm font-medium text-red-700 dark:text-red-400'
              }
            >
              {formatDecimal(Number(trade.r_multiple))}R
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
