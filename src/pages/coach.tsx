import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoachingPanel } from '@/components/coach/coaching-panel';

export function CoachPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Coach</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/coach/setup">
            <Settings className="mr-1.5 h-4 w-4" />
            Setup
          </Link>
        </Button>
      </div>

      <CoachingPanel />
    </div>
  );
}
