import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const LS_KEY = 'neurospect.tradovate.autoFetch';

function getStored(): 'manual' | 'automatic' {
  return (localStorage.getItem(LS_KEY) as 'manual' | 'automatic') ?? 'manual';
}

export function useAutoFetchSetting() {
  return {
    get: getStored,
    set: (v: 'manual' | 'automatic') => localStorage.setItem(LS_KEY, v),
  };
}

export function AutoFetchToggle() {
  const [value, setValue] = useState<'manual' | 'automatic'>(getStored);

  const handleChange = (v: string) => {
    const next = v as 'manual' | 'automatic';
    setValue(next);
    localStorage.setItem(LS_KEY, next);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Fill Mode</Label>
      <RadioGroup value={value} onValueChange={handleChange} className="flex gap-6">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="manual" id="fetch-manual" />
          <Label htmlFor="fetch-manual" className="font-normal cursor-pointer">
            Manual
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="automatic" id="fetch-auto" />
          <Label htmlFor="fetch-auto" className="font-normal cursor-pointer">
            Automatic (background poll — 1d)
          </Label>
        </div>
      </RadioGroup>
      <p className="text-xs text-muted-foreground">
        Manual: click "Fetch from Tradovate" in the trade form. Automatic mode coming in a future update.
      </p>
    </div>
  );
}
