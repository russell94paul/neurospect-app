import { Badge } from '@/components/ui/badge';
import { COACH_BIAS_LABELS, COACH_BIAS_STYLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CoachBias } from '@/types/api';

interface Props {
  bias: CoachBias;
  className?: string;
}

export function BiasBadge({ bias, className }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn('border-0 text-sm font-semibold', COACH_BIAS_STYLES[bias], className)}
    >
      {COACH_BIAS_LABELS[bias]}
    </Badge>
  );
}
