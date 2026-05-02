import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Trade } from '@/types/api';

interface Props {
  open: boolean;
  activeTrade: Trade;
  onDismiss: () => void;
}

export function ActiveTradeGuardDialog({ open, activeTrade, onDismiss }: Props) {
  const navigate = useNavigate();

  const entryTime = activeTrade.entry_time
    ? format(new Date(activeTrade.entry_time), 'HH:mm') + ' ET'
    : null;

  const description = entryTime
    ? `You have an active ${activeTrade.instrument} trade open since ${entryTime}. Tradovate auto-fill is linked to it.`
    : `You have an active ${activeTrade.instrument} trade open. Tradovate auto-fill is linked to it.`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onDismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Active trade already open</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="default"
            onClick={() => navigate(`/trades/${activeTrade.id}`)}
          >
            Go to active trade
          </Button>
          <Button variant="outline" onClick={onDismiss}>
            Start anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
