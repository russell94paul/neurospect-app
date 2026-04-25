import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SCREENSHOT_PHASE_LABELS } from '@/lib/constants';
import { useDeleteScreenshot } from '@/hooks/use-screenshots';
import { ScreenshotViewer } from './screenshot-viewer';
import type { Screenshot, ScreenshotPhase } from '@/types/api';

const PHASE_ORDER: ScreenshotPhase[] = [
  'before_entry',
  'entry',
  'higher_tf',
  'exit',
  'post_trade_review',
];

interface Props {
  tradeId: string;
  screenshots: Screenshot[];
}

export function ScreenshotGrid({ tradeId, screenshots }: Props) {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteScreenshot(tradeId);

  const byPhase = PHASE_ORDER.reduce<Record<ScreenshotPhase, Screenshot[]>>(
    (acc, phase) => {
      acc[phase] = screenshots.filter((s) => s.phase === phase);
      return acc;
    },
    {} as Record<ScreenshotPhase, Screenshot[]>
  );

  const phasesWithScreenshots = PHASE_ORDER.filter((p) => byPhase[p].length > 0);
  if (phasesWithScreenshots.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {phasesWithScreenshots.map((phase) => (
          <div key={phase}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {SCREENSHOT_PHASE_LABELS[phase]}
            </p>
            <div className="flex flex-wrap gap-2">
              {byPhase[phase].map((ss) => (
                <div key={ss.id} className="group relative">
                  <img
                    src={ss.presigned_url ?? ''}
                    alt={`${SCREENSHOT_PHASE_LABELS[phase]} screenshot`}
                    className="h-24 w-36 cursor-pointer rounded border object-cover transition-opacity hover:opacity-80"
                    onClick={() => ss.presigned_url && setViewUrl(ss.presigned_url)}
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 hidden rounded-full bg-destructive p-0.5 text-destructive-foreground group-hover:flex"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(ss.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ScreenshotViewer url={viewUrl} onClose={() => setViewUrl(null)} />

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete screenshot?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId, {
                    onSuccess: () => setDeleteId(null),
                  });
                }
              }}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
