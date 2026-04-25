import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface Props {
  url: string | null;
  onClose: () => void;
}

export function ScreenshotViewer({ url, onClose }: Props) {
  return (
    <Dialog open={url !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-2">
        <DialogTitle className="sr-only">Screenshot Viewer</DialogTitle>
        {url && (
          <img
            src={url}
            alt="Trade screenshot"
            className="max-h-[85vh] w-full rounded object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
