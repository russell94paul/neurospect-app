import { useEffect, useState } from 'react';
import { TradeForm } from '@/components/trade/trade-form';
import { ActiveTradeGuardDialog } from '@/components/trade/active-trade-guard-dialog';
import { useActiveTrade } from '@/hooks/use-active-trade';

export function NewTradePage() {
  const activeTrade = useActiveTrade();
  const [guardOpen, setGuardOpen] = useState(false);
  const [guardDismissed, setGuardDismissed] = useState(false);

  useEffect(() => {
    if (activeTrade && !guardDismissed) {
      setGuardOpen(true);
    }
  }, [activeTrade, guardDismissed]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">New Trade</h1>
      <TradeForm />

      {activeTrade && (
        <ActiveTradeGuardDialog
          open={guardOpen}
          activeTrade={activeTrade}
          onDismiss={() => {
            setGuardOpen(false);
            setGuardDismissed(true);
          }}
        />
      )}
    </div>
  );
}
