import { SettingsShell } from '@/components/settings/settings-shell';
import { BrokerCredentialsForm } from '@/components/settings/broker-credentials-form';
import { BrokerStatusCard } from '@/components/settings/broker-status-card';
import { AutoFetchToggle } from '@/components/settings/auto-fetch-toggle';
import { Separator } from '@/components/ui/separator';

export function BrokerSettingsPage() {
  return (
    <SettingsShell>
      <div className="space-y-6 max-w-xl">
        <div>
          <h1 className="text-2xl font-semibold">Broker Connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect Tradovate to auto-populate trade execution fields.
          </p>
        </div>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-base font-medium">Tradovate</h2>
          <BrokerCredentialsForm />
          <BrokerStatusCard />
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-base font-medium">Auto-Fill Behavior</h2>
          <AutoFetchToggle />
        </section>
      </div>
    </SettingsShell>
  );
}
