import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { FillDTO } from '@/types/api';

interface Props {
  open: boolean;
  fills: FillDTO[];
  role: 'entry' | 'exit';
  onSelect: (fill: FillDTO) => void;
  onClose: () => void;
}

export function TradovateFillPickerDialog({ open, fills, role, onSelect, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Multiple fills found</DialogTitle>
          <DialogDescription>
            Select the {role} fill to apply to this trade.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {fills.map((fill) => (
            <button
              key={fill.tradovate_fill_id}
              type="button"
              onClick={() => onSelect(fill)}
              className="w-full flex items-center justify-between rounded-md border px-4 py-3 text-sm text-left hover:bg-accent transition-colors"
            >
              <div className="space-y-0.5">
                <span className="font-medium">{fill.instrument}</span>
                <span className="ml-2 text-muted-foreground capitalize">{fill.side}</span>
                <span className="ml-2 text-muted-foreground">{fill.qty} ct</span>
              </div>
              <div className="text-right space-y-0.5">
                <p className="font-mono font-medium">{Number(fill.price).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(fill.timestamp), 'HH:mm:ss')} UTC
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
