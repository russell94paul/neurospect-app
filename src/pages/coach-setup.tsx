import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PineScriptCard } from '@/components/coach-setup/pine-script-card';
import { TokenCard } from '@/components/coach-setup/token-card';
import { TvSetupInstructions } from '@/components/coach-setup/tv-setup-instructions';

export function CoachSetupPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/coach">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Coach
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Coach Setup</h1>
      </div>

      <div className="space-y-6">
        <TokenCard />
        <PineScriptCard />
        <TvSetupInstructions />
      </div>
    </div>
  );
}
