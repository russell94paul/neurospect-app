import { useState } from 'react';
import { HTTPError } from 'ky';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBrokerCredentials, useSaveBrokerToken } from '@/hooks/use-tradovate';
import type { BrokerCredentials } from '@/types/api';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

interface ConnectedViewProps {
  credentials: BrokerCredentials;
  onReconnect: () => void;
}

function ConnectedView({ credentials, onReconnect }: ConnectedViewProps) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Connected — {credentials.username_masked}
          </p>
          <p className="text-xs text-green-700 dark:text-green-400">
            Environment: {credentials.environment === 'demo' ? 'Demo' : 'Live'}
          </p>
          <p className="text-xs text-green-700 dark:text-green-400">
            Last connected: {formatDate(credentials.last_auth_at)}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onReconnect}>
          Reconnect
        </Button>
      </div>
    </div>
  );
}

export function BrokerCredentialsForm() {
  const { data: credentials } = useBrokerCredentials();
  const saveToken = useSaveBrokerToken();

  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState('');
  const [environment, setEnvironment] = useState<'demo' | 'live'>('demo');
  const [error, setError] = useState<string | null>(null);

  const isConnected = credentials?.is_connected === true;
  const showPasteForm = !isConnected || showForm;

  const handleConnect = async () => {
    if (!token.trim()) return;
    setError(null);
    try {
      await saveToken.mutateAsync({ access_token: token.trim(), environment });
      setToken('');
      setShowForm(false);
    } catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json().catch(() => ({}));
        setError((body as { detail?: string }).detail ?? 'Failed to save token.');
      } else {
        setError('Unexpected error. Check the console.');
      }
    }
  };

  if (isConnected && !showForm) {
    return (
      <ConnectedView
        credentials={credentials}
        onReconnect={() => setShowForm(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-md border bg-muted/40 p-4 text-sm space-y-2">
        <p className="font-medium">How to get your Tradovate token:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
          <li>Log in at <span className="font-mono">trader.tradovate.com</span></li>
          <li>Open DevTools (F12) → Network tab</li>
          <li>Click any request to <span className="font-mono">demo.tradovateapi.com</span></li>
          <li>
            Find <span className="font-mono">Authorization: Bearer …</span> in the request headers
          </li>
          <li>Copy everything after <span className="font-mono">Bearer </span> (the long JWT string)</li>
        </ol>
        <p className="text-muted-foreground text-xs">
          Token lifetime is ~1–2 hours. You'll need to re-paste when it expires.
        </p>
      </div>

      {/* Token textarea */}
      <div className="space-y-2">
        <Label htmlFor="token-paste">Bearer Token</Label>
        <Textarea
          id="token-paste"
          placeholder="eyJ0eXAiOiJKV1QiLCJhbGci…"
          rows={4}
          className="font-mono text-xs"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      {/* Environment */}
      <div className="space-y-2">
        <Label>Environment</Label>
        <RadioGroup
          value={environment}
          onValueChange={(v) => setEnvironment(v as 'demo' | 'live')}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="demo" id="env-demo" />
            <Label htmlFor="env-demo" className="font-normal cursor-pointer">Demo</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="live" id="env-live" />
            <Label htmlFor="env-live" className="font-normal cursor-pointer">Live</Label>
          </div>
        </RadioGroup>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleConnect}
          disabled={!token.trim() || saveToken.isPending}
        >
          {saveToken.isPending ? 'Connecting…' : 'Connect'}
        </Button>
        {showPasteForm && isConnected && (
          <Button variant="ghost" onClick={() => { setShowForm(false); setToken(''); setError(null); }}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
