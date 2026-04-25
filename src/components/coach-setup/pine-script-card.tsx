import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function PineScriptCard() {
  const [open, setOpen] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/neurospect-coach.pine')
      .then((r) => r.text())
      .then(setScript)
      .catch(() => setScript(null));
  }, []);

  const copyScript = async () => {
    if (!script) return;
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pine Script</CardTitle>
          <Button asChild variant="outline" size="sm">
            <a href="/neurospect-coach.pine" download>
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Add this indicator to your TradingView chart to send coaching requests to Neurospect.
        </p>

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {open ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {open ? 'Hide script' : 'Show script'}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            {script ? (
              <div className="relative">
                <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                  {script}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={copyScript}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading script…</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
