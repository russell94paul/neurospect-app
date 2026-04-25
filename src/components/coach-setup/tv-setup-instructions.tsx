import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    n: 1,
    text: 'Download the Pine Script using the button above (or expand to copy it).',
  },
  {
    n: 2,
    text: 'In TradingView, open the Pine Editor (bottom panel) and paste the script. Click "Add to chart."',
  },
  {
    n: 3,
    text: (
      <>
        In the indicator settings (<strong>Neurospect Coach</strong> ⚙️), enter your{' '}
        <strong>Webhook shared secret</strong> — this must match the{' '}
        <code className="rounded bg-muted px-1 font-mono text-xs">TRADINGVIEW_WEBHOOK_SECRET</code>{' '}
        environment variable set on the backend.
      </>
    ),
  },
  {
    n: 4,
    text: (
      <>
        Create a new alert on the <strong>Neurospect Coach</strong> indicator. In the{' '}
        <strong>Condition</strong> dropdown, select <em>neurospect-coach</em>. Leave the{' '}
        <strong>Message</strong> field as <code className="rounded bg-muted px-1 font-mono text-xs">{'{}'}</code>{' '}
        — the alert body is assembled by the Pine script and sent directly via{' '}
        <code className="rounded bg-muted px-1 font-mono text-xs">alert()</code>.
      </>
    ),
  },
  {
    n: 5,
    text: (
      <>
        In the alert's <strong>Notifications</strong> tab, enable <strong>Webhook URL</strong> and
        paste your webhook URL from the Token Card above.
      </>
    ),
  },
  {
    n: 6,
    text: (
      <>
        Save the alert. To request coaching, flip the{' '}
        <strong>Request coaching</strong> toggle in the indicator inputs from{' '}
        <strong>OFF → ON</strong>. The rising edge fires a single alert. Flip it back to arm for
        the next request.
      </>
    ),
  },
];

export function TvSetupInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TradingView Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-4">
          {steps.map(({ n, text }) => (
            <li key={n} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {n}
              </span>
              <span className="leading-relaxed text-muted-foreground">{text}</span>
            </li>
          ))}
        </ol>

        <div className="flex gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            The <code className="rounded bg-muted px-1 font-mono text-xs">secret</code> field
            embedded in the Pine payload acts as a second factor alongside the per-user webhook
            token. Both must be correct for the backend to accept a request. Keep{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">TRADINGVIEW_WEBHOOK_SECRET</code>{' '}
            private.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
