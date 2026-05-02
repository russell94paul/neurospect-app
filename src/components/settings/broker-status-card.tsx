import { useBrokerCredentials, useDeleteBrokerCredentials, useTestBrokerCredentials } from '@/hooks/use-tradovate';
import { Button } from '@/components/ui/button';

export function BrokerStatusCard() {
  const { data: credentials, isLoading } = useBrokerCredentials();
  const testCreds = useTestBrokerCredentials();
  const deleteCreds = useDeleteBrokerCredentials();

  if (isLoading || !credentials) return null;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              credentials.is_connected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {credentials.is_connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground capitalize">{credentials.environment}</span>
      </div>

      {!credentials.is_connected && (
        <p className="text-xs text-destructive">
          Session token expired. Re-paste a fresh token above.
        </p>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => testCreds.mutate()}
          disabled={testCreds.isPending}
        >
          {testCreds.isPending ? 'Testing…' : 'Test connection'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => deleteCreds.mutate()}
          disabled={deleteCreds.isPending}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
}
