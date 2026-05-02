import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/sidebar';
import { UserMenu } from '@/components/layout/user-menu';
import { useActiveTrade } from '@/hooks/use-active-trade';
import { useBrokerCredentials } from '@/hooks/use-tradovate';

function formatET(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function ActiveTradeBadge() {
  const activeTrade = useActiveTrade();
  const navigate = useNavigate();

  if (!activeTrade) return null;

  const timeLabel = activeTrade.entry_time
    ? ` · ${formatET(activeTrade.entry_time)} ET`
    : '';

  return (
    <button
      type="button"
      onClick={() => navigate(`/trades/${activeTrade.id}`)}
      className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-100 transition-colors dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
    >
      <span className="h-2 w-2 rounded-full bg-green-500" />
      Active: {activeTrade.instrument}{timeLabel}
    </button>
  );
}

function BrokerDisconnectedBanner() {
  const { data: credentials } = useBrokerCredentials();

  if (!credentials || credentials.is_connected) return null;

  return (
    <div className="bg-destructive px-4 py-2 text-center text-xs font-medium text-destructive-foreground">
      Tradovate disconnected — reconnect in{' '}
      <a href="/settings/broker" className="underline underline-offset-2">
        Settings
      </a>
    </div>
  );
}

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Broker disconnected banner */}
        <BrokerDisconnectedBanner />
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-3">
            <ActiveTradeBadge />
          </div>
          <UserMenu />
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
