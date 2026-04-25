import { useCallback, useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadScreenshot } from '@/hooks/use-screenshots';
import { SCREENSHOT_PHASE_LABELS } from '@/lib/constants';
import type { ScreenshotPhase } from '@/types/api';

interface Props {
  tradeId: string;
  phase: ScreenshotPhase;
  onUploaded?: () => void;
}

export function ScreenshotUpload({ tradeId, phase, onUploaded }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadScreenshot(tradeId);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      setError(null);
      upload.mutate(
        { file, phase },
        {
          onSuccess: () => onUploaded?.(),
          onError: (err: unknown) => {
            const msg =
              err instanceof Error
                ? err.message
                : 'Upload failed. Screenshot storage may not be configured.';
            setError(msg);
          },
        }
      );
    },
    [upload, phase, onUploaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">
        {SCREENSHOT_PHASE_LABELS[phase]}
      </p>
      <div
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          upload.isPending && 'pointer-events-none opacity-60'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {upload.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground">
          {upload.isPending ? 'Uploading…' : 'Drop or click to upload'}
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
