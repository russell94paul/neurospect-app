import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { HTTPError } from 'ky';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApplyTradovateFill, useBrokerCredentials, useFetchTradovateFills } from '@/hooks/use-tradovate';
import { useActiveTrade } from '@/hooks/use-active-trade';
import { TradovateFillPickerDialog } from './tradovate-fill-picker-dialog';
import type { FillDTO, Trade } from '@/types/api';

interface Props {
  role: 'entry' | 'exit';
  trade: Trade;
  onFillApplied: (updated: Trade) => void;
}

interface StatusMsg {
  type: 'success' | 'error' | 'info';
  text: string;
}

function formatET(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function TradovateFillButton({ role, trade, onFillApplied }: Props) {
  const { data: credentials } = useBrokerCredentials();
  const activeTrade = useActiveTrade();
  const fetchFills = useFetchTradovateFills();
  const applyFill = useApplyTradovateFill(trade.id);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFills, setPickerFills] = useState<FillDTO[]>([]);
  const [status, setStatus] = useState<StatusMsg | null>(null);

  // Auto-clear status message after 4 seconds
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  // Determine disabled reason
  const noCredentials = !credentials;
  const disconnected = credentials !== null && credentials !== undefined && !credentials.is_connected;
  const overrideLocked = activeTrade !== null && activeTrade.id !== trade.id;
  const isBusy = fetchFills.isPending || applyFill.isPending;

  const isDisabled = noCredentials || disconnected || overrideLocked || isBusy;

  const tooltipText = (() => {
    if (noCredentials) return 'Connect Tradovate in Settings →';
    if (disconnected) return 'Reconnect Tradovate in Settings →';
    if (overrideLocked && activeTrade) {
      const time = activeTrade.entry_time ? formatET(activeTrade.entry_time) : '?';
      return `Auto-fill paused — close ${activeTrade.instrument} ${time} first`;
    }
    return null;
  })();

  const handleApply = async (fill: FillDTO) => {
    try {
      const updated = await applyFill.mutateAsync({
        tradovate_fill_id: fill.tradovate_fill_id,
        role,
      });
      onFillApplied(updated);
      setStatus({
        type: 'success',
        text: `Filled at ${format(new Date(fill.timestamp), 'HH:mm:ss')} UTC`,
      });
    } catch (e) {
      const msg =
        e instanceof HTTPError
          ? `Error: ${e.response.status}`
          : 'Failed to apply fill';
      setStatus({ type: 'error', text: msg });
    }
  };

  const handleClick = async () => {
    setStatus(null);
    try {
      const fills = await fetchFills.mutateAsync({
        trade_date: trade.trade_date,
        instrument: trade.instrument,
      });

      if (fills.length === 0) {
        setStatus({
          type: 'info',
          text: `No fills found for ${trade.instrument} on ${trade.trade_date}`,
        });
      } else if (fills.length === 1) {
        await handleApply(fills[0]);
      } else {
        setPickerFills(fills);
        setPickerOpen(true);
      }
    } catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json().catch(() => ({}));
        const detail = (body as { detail?: string }).detail;
        if (e.response.status === 401 || e.response.status === 503) {
          setStatus({ type: 'error', text: 'Reconnect Tradovate in Settings' });
        } else {
          setStatus({ type: 'error', text: detail ?? 'Failed to fetch fills' });
        }
      } else {
        setStatus({ type: 'error', text: 'Failed to fetch fills' });
      }
    }
  };

  const button = (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isDisabled}
      onClick={handleClick}
      className="gap-1.5 text-xs"
    >
      <RefreshCw className={`h-3 w-3 ${isBusy ? 'animate-spin' : ''}`} />
      {isBusy ? 'Fetching…' : 'Fetch from Tradovate'}
    </Button>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col items-end gap-1">
        {tooltipText ? (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
          </Tooltip>
        ) : (
          button
        )}

        {status && (
          <p
            className={`text-xs ${
              status.type === 'success'
                ? 'text-green-600 dark:text-green-400'
                : status.type === 'error'
                ? 'text-destructive'
                : 'text-muted-foreground'
            }`}
          >
            {status.text}
          </p>
        )}
      </div>

      <TradovateFillPickerDialog
        open={pickerOpen}
        fills={pickerFills}
        role={role}
        onSelect={async (fill) => {
          setPickerOpen(false);
          await handleApply(fill);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </TooltipProvider>
  );
}
