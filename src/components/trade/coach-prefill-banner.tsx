import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onClear: () => void;
}

export function CoachPrefillBanner({ onClear }: Props) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Pre-filled from coach</span>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
