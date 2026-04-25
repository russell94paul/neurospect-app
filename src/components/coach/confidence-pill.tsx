import { Badge } from '@/components/ui/badge';
import { CONFIDENCE_LABELS, CONFIDENCE_STYLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Confidence } from '@/types/api';

interface Props {
  confidence: Confidence;
  className?: string;
}

export function ConfidencePill({ confidence, className }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn('border-0 text-xs', CONFIDENCE_STYLES[confidence], className)}
    >
      {CONFIDENCE_LABELS[confidence]}
    </Badge>
  );
}
