import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TRADE_STATUS_LABELS, OUTCOME_LABELS } from '@/lib/constants';
import type { OutcomeType, TradeStatus } from '@/types/api';

interface Props {
  status: TradeStatus;
  outcome?: OutcomeType | null;
  className?: string;
}

export function StatusBadge({ status, outcome, className }: Props) {
  const colorClass = getColorClass(status, outcome);
  const label = getLabel(status, outcome);

  return (
    <Badge className={cn(colorClass, 'border-0', className)} variant="outline">
      {label}
    </Badge>
  );
}

function getColorClass(status: TradeStatus, outcome?: OutcomeType | null) {
  if (status === 'pre_trade') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  if (status === 'active') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  if (status === 'closed') {
    if (outcome === 'win') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (outcome === 'loss') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
  return '';
}

function getLabel(status: TradeStatus, outcome?: OutcomeType | null) {
  if (status === 'closed' && outcome) {
    return `Closed — ${OUTCOME_LABELS[outcome]}`;
  }
  return TRADE_STATUS_LABELS[status];
}
