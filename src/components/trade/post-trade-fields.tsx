import type { Control } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GRADE_OPTIONS, OUTCOME_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { MistakeTagInput } from './mistake-tag-input';
import { TradovateFillButton } from './tradovate-fill-button';
import type { Trade } from '@/types/api';
import type { TradeFormValues } from './trade-form';

interface Props {
  control: Control<TradeFormValues>;
  trade?: Trade;
  onFillApplied?: (updated: Trade) => void;
}

const OUTCOME_COLORS: Record<string, string> = {
  win: 'border-green-500 text-green-700 data-[state=checked]:bg-green-100 dark:text-green-400',
  loss: 'border-red-500 text-red-700 data-[state=checked]:bg-red-100 dark:text-red-400',
  breakeven: 'border-gray-400 text-gray-600 dark:text-gray-400',
};

export function PostTradeFields({ control, trade, onFillApplied }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Tradovate fetch row — edit mode only */}
      {trade && onFillApplied && (
        <div className="sm:col-span-2 flex justify-end">
          <TradovateFillButton role="exit" trade={trade} onFillApplied={onFillApplied} />
        </div>
      )}

      {/* Exit Price */}
      <FormField
        control={control}
        name="exit_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exit Price</FormLabel>
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

      {/* Exit Time */}
      <FormField
        control={control}
        name="exit_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exit Time</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Outcome */}
      <FormField
        control={control}
        name="outcome"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Outcome</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ?? ''}
                onValueChange={(v) => field.onChange(v === '' ? null : v)}
                className="flex gap-4"
              >
                {OUTCOME_OPTIONS.map((o) => (
                  <div key={o.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={o.value}
                      id={`outcome-${o.value}`}
                      className={cn(OUTCOME_COLORS[o.value])}
                    />
                    <Label
                      htmlFor={`outcome-${o.value}`}
                      className={cn(
                        'cursor-pointer font-medium',
                        o.value === 'win' && 'text-green-700 dark:text-green-400',
                        o.value === 'loss' && 'text-red-700 dark:text-red-400',
                        o.value === 'breakeven' && 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {o.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* R Multiple */}
      <FormField
        control={control}
        name="r_multiple"
        render={({ field }) => (
          <FormItem>
            <FormLabel>R-Multiple</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="Auto-calculated from prices"
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

      {/* MAE */}
      <FormField
        control={control}
        name="mae"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MAE (Max Adverse Excursion)</FormLabel>
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

      {/* MFE */}
      <FormField
        control={control}
        name="mfe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MFE (Max Favorable Excursion)</FormLabel>
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

      {/* Target Reached + Plan Followed */}
      <FormField
        control={control}
        name="target_reached"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="cursor-pointer font-normal">Target reached</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="plan_followed"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="cursor-pointer font-normal">Plan followed</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mistake Tags */}
      <FormField
        control={control}
        name="mistake_tags"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Mistake Tags</FormLabel>
            <FormControl>
              <MistakeTagInput
                value={field.value ?? []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Quality Grade */}
      <FormField
        control={control}
        name="quality_grade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quality Grade</FormLabel>
            <Select
              onValueChange={(v) => field.onChange(v === '_none' ? null : v)}
              value={field.value ?? '_none'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Grade this trade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                {GRADE_OPTIONS.map((o) => (
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

      {/* Post Trade Notes */}
      <FormField
        control={control}
        name="post_trade_notes"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Post-Trade Notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ''}
                placeholder="What did you do well? What went wrong? What would you do differently?"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
