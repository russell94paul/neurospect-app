import type { Control } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DISPLACEMENT_OPTIONS, PDA_OPTIONS } from '@/lib/constants';
import { TradovateFillButton } from './tradovate-fill-button';
import type { Trade } from '@/types/api';
import type { TradeFormValues } from './trade-form';

interface Props {
  control: Control<TradeFormValues>;
  trade?: Trade;
  onFillApplied?: (updated: Trade) => void;
}

export function EntryFields({ control, trade, onFillApplied }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Tradovate fetch row — edit mode only */}
      {trade && onFillApplied && (
        <div className="sm:col-span-2 flex justify-end">
          <TradovateFillButton role="entry" trade={trade} onFillApplied={onFillApplied} />
        </div>
      )}
      {/* Entry Price */}
      <FormField
        control={control}
        name="entry_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Price</FormLabel>
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

      {/* Entry Time */}
      <FormField
        control={control}
        name="entry_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Time</FormLabel>
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

      {/* Position Size */}
      <FormField
        control={control}
        name="position_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position Size (contracts)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="1"
                min="1"
                placeholder="1"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stop Price */}
      <FormField
        control={control}
        name="stop_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stop Price</FormLabel>
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

      {/* Stop Logic */}
      <FormField
        control={control}
        name="stop_logic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stop Logic</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="Why is your stop here?"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Target Price */}
      <FormField
        control={control}
        name="target_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Price</FormLabel>
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

      {/* Target Logic */}
      <FormField
        control={control}
        name="target_logic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Logic</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder="What is the target liquidity?"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Entry PDA */}
      <FormField
        control={control}
        name="entry_pda"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry PDA</FormLabel>
            <Select
              onValueChange={(v) => field.onChange(v === '_none' ? null : v)}
              value={field.value ?? '_none'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select PDA" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                {PDA_OPTIONS.map((o) => (
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

      {/* Displacement Quality */}
      <FormField
        control={control}
        name="displacement_quality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Displacement Quality</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ?? ''}
                onValueChange={(v) => field.onChange(v === '' ? null : v)}
                className="flex gap-4 pt-1"
              >
                {DISPLACEMENT_OPTIONS.map((o) => (
                  <div key={o.value} className="flex items-center gap-2">
                    <RadioGroupItem value={o.value} id={`disp-${o.value}`} />
                    <Label htmlFor={`disp-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SMT Confirmation */}
      <FormField
        control={control}
        name="smt_confirmation"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0 pt-2">
            <FormControl>
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="cursor-pointer font-normal">SMT confirmation present</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
