import { TradeForm } from '@/components/trade/trade-form';

export function NewTradePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">New Trade</h1>
      <TradeForm />
    </div>
  );
}
