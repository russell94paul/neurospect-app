import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  OUTCOME_OPTIONS,
  SESSION_OPTIONS,
  SETUP_TYPE_OPTIONS,
  TRADE_STATUS_OPTIONS,
} from '@/lib/constants';

export function TradeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? '';

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const clear = () => setSearchParams(new URLSearchParams());

  const hasFilters = Array.from(searchParams.keys()).filter((k) => k !== 'page').length > 0;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap gap-3">
        {/* Date range */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input
            type="date"
            className="h-8 w-36 text-sm"
            value={get('date_start')}
            onChange={(e) => set('date_start', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input
            type="date"
            className="h-8 w-36 text-sm"
            value={get('date_end')}
            onChange={(e) => set('date_end', e.target.value)}
          />
        </div>

        {/* Instrument */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Instrument</Label>
          <Input
            className="h-8 w-24 text-sm"
            placeholder="NQ, ES…"
            value={get('instrument')}
            onChange={(e) => set('instrument', e.target.value)}
          />
        </div>

        {/* Session */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Session</Label>
          <Select value={get('session') || '_all'} onValueChange={(v) => set('session', v === '_all' ? '' : v)}>
            <SelectTrigger className="h-8 w-32 text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All</SelectItem>
              {SESSION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Setup Type */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Setup</Label>
          <Select value={get('setup_type') || '_all'} onValueChange={(v) => set('setup_type', v === '_all' ? '' : v)}>
            <SelectTrigger className="h-8 w-44 text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All</SelectItem>
              {SETUP_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Outcome */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Outcome</Label>
          <Select value={get('outcome') || '_all'} onValueChange={(v) => set('outcome', v === '_all' ? '' : v)}>
            <SelectTrigger className="h-8 w-32 text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All</SelectItem>
              {OUTCOME_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={get('status') || '_all'} onValueChange={(v) => set('status', v === '_all' ? '' : v)}>
            <SelectTrigger className="h-8 w-32 text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All</SelectItem>
              {TRADE_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear */}
        {hasFilters && (
          <div className="flex flex-col justify-end">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clear}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
