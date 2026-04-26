import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TradeFormValues } from './trade-form';

const FIELD_LABELS: Partial<Record<keyof TradeFormValues, string>> = {
  instrument: 'Instrument',
  session: 'Session',
  htf_bias: 'HTF Bias',
  htf_fvg_low: 'FVG Low',
  htf_fvg_high: 'FVG High',
  news_flag: 'News Flag',
};

interface Props {
  fieldNames: (keyof TradeFormValues)[];
  onConfirm: () => void;
  onClear: () => void;
}

export function CoachPrefillBanner({ fieldNames, onConfirm, onClear }: Props) {
  const labels = fieldNames.map((k) => FIELD_LABELS[k]).filter(Boolean).join(', ');

  return (
    <div className="flex items-start justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm dark:border-amber-700 dark:bg-amber-950/40">
      <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-medium">Pre-filled from coach</span>
          {labels && (
            <span className="ml-1 text-amber-700 dark:text-amber-400">— {labels}</span>
          )}
        </span>
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-0.5 text-amber-800 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-amber-900/40"
          onClick={onConfirm}
        >
          Got it
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-0.5 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/40"
          onClick={onClear}
        >
          Reset fields
        </Button>
      </div>
    </div>
  );
}
