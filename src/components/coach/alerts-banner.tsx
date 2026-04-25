import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  alerts: string[];
}

export function AlertsBanner({ alerts }: Props) {
  if (alerts.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <CardContent className="space-y-1.5 py-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {alert}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
