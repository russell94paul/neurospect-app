import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  BIAS_OPTIONS,
  KILL_ZONE_OPTIONS,
  OPP_OPTIONS,
  SESSION_OPTIONS,
  SETUP_TYPE_OPTIONS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { TradeFormValues } from './trade-form';

interface Props {
  control: Control<TradeFormValues>;
  defaultAdvancedOpen?: boolean;
  prefilledFields?: Set<keyof TradeFormValues>;
}

export function PreTradeFields({ control, defaultAdvancedOpen = false, prefilledFields }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(defaultAdvancedOpen);
  const hl = (...keys: (keyof TradeFormValues)[]) =>
    keys.some((k) => prefilledFields?.has(k))
      ? 'ring-1 ring-amber-400 rounded-md dark:ring-amber-500'
      : '';

  return (
    <div className="flex flex-col gap-4">
      {/* ---- Prominent fields ---- */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Trade Date */}
        <FormField
          control={control}
          name="trade_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Trade Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(parseISO(field.value), 'PPP') : 'Pick a date'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instrument */}
        <FormField
          control={control}
          name="instrument"
          render={({ field }) => (
            <FormItem className={hl('instrument')}>
              <FormLabel>Instrument *</FormLabel>
              <FormControl>
                <Input {...field} list="instrument-suggestions" placeholder="NQ, ES, YM…" />
              </FormControl>
              <datalist id="instrument-suggestions">
                {['NQ', 'ES', 'YM', 'GC', 'CL'].map((i) => (
                  <option key={i} value={i} />
                ))}
              </datalist>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Session */}
        <FormField
          control={control}
          name="session"
          render={({ field }) => (
            <FormItem className={hl('session')}>
              <FormLabel>Session</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === '_none' ? null : v)}
                value={field.value ?? '_none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {SESSION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kill Zone */}
        <FormField
          control={control}
          name="kill_zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kill Zone</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === '_none' ? null : v)}
                value={field.value ?? '_none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select kill zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {KILL_ZONE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* HTF Bias */}
        <FormField
          control={control}
          name="htf_bias"
          render={({ field }) => (
            <FormItem className={cn('sm:col-span-2', hl('htf_bias'))}>
              <FormLabel>HTF Bias</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={(v) => field.onChange(v === '' ? null : v)}
                  className="flex gap-4"
                >
                  {BIAS_OPTIONS.map((o) => (
                    <div key={o.value} className="flex items-center gap-2">
                      <RadioGroupItem value={o.value} id={`bias-${o.value}`} />
                      <Label htmlFor={`bias-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Setup Type */}
        <FormField
          control={control}
          name="setup_type"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Setup Type</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v === '_none' ? null : v)}
                value={field.value ?? '_none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select setup" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {SETUP_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Narrative */}
        <FormField
          control={control}
          name="narrative"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Narrative</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Pre-trade thesis — what do you expect and why?"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ---- Advanced collapsible ---- */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {advancedOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Advanced
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* HTF FVG Low */}
            <FormField
              control={control}
              name="htf_fvg_low"
              render={({ field }) => (
                <FormItem className={hl('htf_fvg_low')}>
                  <FormLabel>HTF FVG Low</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HTF FVG High */}
            <FormField
              control={control}
              name="htf_fvg_high"
              render={({ field }) => (
                <FormItem className={hl('htf_fvg_high')}>
                  <FormLabel>HTF FVG High</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Draw on Liquidity */}
            <FormField
              control={control}
              name="draw_on_liquidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Draw on Liquidity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Describe target liquidity…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DOL Price Level */}
            <FormField
              control={control}
              name="dol_price_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOL Price Level</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opening Price Position */}
            <FormField
              control={control}
              name="opening_price_position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Price Position</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === '_none' ? null : v)}
                    value={field.value ?? '_none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="_none">None</SelectItem>
                      {OPP_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* News Flag */}
            <FormField
              control={control}
              name="news_flag"
              render={({ field }) => (
                <FormItem className={cn('flex items-center gap-2 space-y-0 pt-6', hl('news_flag'))}>
                  <FormControl>
                    <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal">News event present</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
