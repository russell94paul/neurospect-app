import { useState } from 'react';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useRevokeTvToken, useRotateTvToken, useTvToken } from '@/hooks/use-tv-token';
import { formatDate } from '@/lib/utils';

export function TokenCard() {
  const { data, isLoading } = useTvToken();
  const rotate = useRotateTvToken();
  const revoke = useRevokeTvToken();

  const [rotateOpen, setRotateOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyWebhook = async () => {
    if (!data?.webhook_url) return;
    await navigator.clipboard.writeText(data.webhook_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || data === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Webhook Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  const maskedToken = data
    ? data.token.slice(0, 6) + '…' + data.token.slice(-6)
    : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Webhook Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data === null ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No active token.</p>
              <Button onClick={() => rotate.mutate()} disabled={rotate.isPending}>
                {rotate.isPending ? 'Generating…' : 'Generate Token'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Token</Label>
                <p className="font-mono text-sm text-muted-foreground">{maskedToken}</p>
              </div>

              <div className="space-y-1.5">
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={data.webhook_url}
                    className="font-mono text-xs"
                    onFocus={(e) => e.target.select()}
                  />
                  <Button variant="outline" size="icon" onClick={copyWebhook} title="Copy webhook URL">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 dark:text-green-400">Copied to clipboard</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Created</Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(data.created_at)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setRotateOpen(true)}
                  disabled={rotate.isPending}
                >
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Rotate Token
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setRevokeOpen(true)}
                  disabled={revoke.isPending}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Revoke Token
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rotate confirmation */}
      <Dialog open={rotateOpen} onOpenChange={setRotateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rotate Token</DialogTitle>
            <DialogDescription>
              This will revoke your current token and generate a new one. You will need to update the
              webhook URL in TradingView.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRotateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                rotate.mutate();
                setRotateOpen(false);
              }}
            >
              Rotate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke confirmation */}
      <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Token</DialogTitle>
            <DialogDescription>
              This will permanently revoke your webhook token. TradingView alerts will stop working
              until you generate a new token.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                revoke.mutate();
                setRevokeOpen(false);
              }}
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
