import { useEffect, useState } from 'react';
import { type Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useCreateTrade, useDeleteTrade, useUpdateTrade } from '@/hooks/use-trades';
import type { Trade, TradeStatus } from '@/types/api';
import { EntryFields } from './entry-fields';
import { PostTradeFields } from './post-trade-fields';
import { PreTradeFields } from './pre-trade-fields';
import { StatusBadge } from './status-badge';

// ============================================================
// Schema & Types
// ============================================================

const tradeFormSchema = z.object({
  trade_date: z.string().min(1, 'Trade date is required'),
  instrument: z.string().min(1, 'Instrument is required'),
  session: z.string().nullable().optional(),
  kill_zone: z.string().nullable().optional(),
  htf_bias: z.string().nullable().optional(),
  htf_fvg_low: z.number().nullable().optional(),
  htf_fvg_high: z.number().nullable().optional(),
  draw_on_liquidity: z.string().nullable().optional(),
  dol_price_level: z.number().nullable().optional(),
  opening_price_position: z.string().nullable().optional(),
  news_flag: z.boolean(),
  setup_type: z.string().nullable().optional(),
  narrative: z.string().nullable().optional(),
  entry_price: z.number().nullable().optional(),
  entry_time: z.string().nullable().optional(),
  stop_price: z.number().nullable().optional(),
  stop_logic: z.string().nullable().optional(),
  target_price: z.number().nullable().optional(),
  target_logic: z.string().nullable().optional(),
  entry_pda: z.string().nullable().optional(),
  displacement_quality: z.string().nullable().optional(),
  smt_confirmation: z.boolean().nullable().optional(),
  exit_price: z.number().nullable().optional(),
  exit_time: z.string().nullable().optional(),
  outcome: z.string().nullable().optional(),
  r_multiple: z.number().nullable().optional(),
  mae: z.number().nullable().optional(),
  mfe: z.number().nullable().optional(),
  target_reached: z.boolean().nullable().optional(),
  plan_followed: z.boolean().nullable().optional(),
  mistake_tags: z.array(z.string()),
  quality_grade: z.string().nullable().optional(),
  post_trade_notes: z.string().nullable().optional(),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;
// Convenience alias for passing down to field components
export type TradeControl = Control<TradeFormValues>;

// ============================================================
// Helpers
// ============================================================

function toFormValues(trade: Trade): TradeFormValues {
  return {
    trade_date: trade.trade_date,
    instrument: trade.instrument,
    session: trade.session,
    kill_zone: trade.kill_zone,
    htf_bias: trade.htf_bias,
    htf_fvg_low: trade.htf_fvg_low != null ? Number(trade.htf_fvg_low) : null,
    htf_fvg_high: trade.htf_fvg_high != null ? Number(trade.htf_fvg_high) : null,
    draw_on_liquidity: trade.draw_on_liquidity,
    dol_price_level: trade.dol_price_level != null ? Number(trade.dol_price_level) : null,
    opening_price_position: trade.opening_price_position,
    news_flag: trade.news_flag,
    setup_type: trade.setup_type,
    narrative: trade.narrative,
    entry_price: trade.entry_price != null ? Number(trade.entry_price) : null,
    // datetime-local requires "YYYY-MM-DDTHH:mm"
    entry_time: trade.entry_time ? trade.entry_time.slice(0, 16) : null,
    stop_price: trade.stop_price != null ? Number(trade.stop_price) : null,
    stop_logic: trade.stop_logic,
    target_price: trade.target_price != null ? Number(trade.target_price) : null,
    target_logic: trade.target_logic,
    entry_pda: trade.entry_pda,
    displacement_quality: trade.displacement_quality,
    smt_confirmation: trade.smt_confirmation,
    exit_price: trade.exit_price != null ? Number(trade.exit_price) : null,
    exit_time: trade.exit_time ? trade.exit_time.slice(0, 16) : null,
    outcome: trade.outcome,
    r_multiple: trade.r_multiple != null ? Number(trade.r_multiple) : null,
    mae: trade.mae != null ? Number(trade.mae) : null,
    mfe: trade.mfe != null ? Number(trade.mfe) : null,
    target_reached: trade.target_reached,
    plan_followed: trade.plan_followed,
    mistake_tags: trade.mistake_tags ?? [],
    quality_grade: trade.quality_grade,
    post_trade_notes: trade.post_trade_notes,
  };
}

function buildPatch(
  values: TradeFormValues,
  dirtyFields: Partial<Record<keyof TradeFormValues, boolean | unknown>>
): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [key, dirty] of Object.entries(dirtyFields)) {
    if (dirty) {
      const v = values[key as keyof TradeFormValues];
      patch[key] = v ?? null;
    }
  }
  return patch;
}

// ============================================================
// Component
// ============================================================

interface Props {
  trade?: Trade;
  onSuccess?: () => void;
}

const POST_TRADE_KEYS = new Set([
  'exit_price', 'exit_time', 'outcome', 'r_multiple', 'mae', 'mfe',
  'target_reached', 'plan_followed', 'mistake_tags', 'quality_grade', 'post_trade_notes',
]);

export function TradeForm({ trade, onSuccess }: Props) {
  const isEdit = !!trade;
  const status = trade?.status ?? 'pre_trade';

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [preTradeSectionOpen, setPreTradeSectionOpen] = useState(true);
  const [entrySectionOpen, setEntrySectionOpen] = useState(status !== 'pre_trade');
  const [postTradeSectionOpen, setPostTradeSectionOpen] = useState(status === 'closed');

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: isEdit
      ? toFormValues(trade)
      : {
          trade_date: '',
          instrument: '',
          session: null,
          kill_zone: null,
          htf_bias: null,
          htf_fvg_low: null,
          htf_fvg_high: null,
          draw_on_liquidity: null,
          dol_price_level: null,
          opening_price_position: null,
          news_flag: false,
          setup_type: null,
          narrative: null,
          entry_price: null,
          entry_time: null,
          stop_price: null,
          stop_logic: null,
          target_price: null,
          target_logic: null,
          entry_pda: null,
          displacement_quality: null,
          smt_confirmation: null,
          exit_price: null,
          exit_time: null,
          outcome: null,
          r_multiple: null,
          mae: null,
          mfe: null,
          target_reached: null,
          plan_followed: null,
          mistake_tags: [],
          quality_grade: null,
          post_trade_notes: null,
        },
  });

  const createTrade = useCreateTrade();
  const updateTrade = useUpdateTrade(trade?.id ?? '');
  const deleteTrade = useDeleteTrade();

  // R-multiple auto-calculation
  const [entryPrice, stopPrice, exitPrice] = form.watch(['entry_price', 'stop_price', 'exit_price']);
  useEffect(() => {
    if (entryPrice != null && stopPrice != null && exitPrice != null && entryPrice !== stopPrice) {
      let r: number;
      if (entryPrice > stopPrice) {
        // long
        r = (exitPrice - entryPrice) / (entryPrice - stopPrice);
      } else {
        // short
        r = (entryPrice - exitPrice) / (stopPrice - entryPrice);
      }
      form.setValue('r_multiple', parseFloat(r.toFixed(2)), { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryPrice, stopPrice, exitPrice]);

  const onSubmit = (values: TradeFormValues, targetStatus?: TradeStatus) => {
    if (!isEdit) {
      // Create: exclude post-trade fields (not part of TradeCreate schema)
      const createFields = Object.fromEntries(
        Object.entries(values).filter(([k]) => !POST_TRADE_KEYS.has(k))
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createTrade.mutate(createFields as any);
    } else {
      // Edit: send only dirty fields + optional status transition
      const patch = buildPatch(values, form.formState.dirtyFields);
      if (targetStatus) patch.status = targetStatus;
      if (Object.keys(patch).length === 0) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateTrade.mutate(patch as any, { onSuccess: () => onSuccess?.() });
    }
  };

  const isBusy = createTrade.isPending || updateTrade.isPending || deleteTrade.isPending;

  // Cast control — required due to RHF + Zod resolver generic parameter constraints
  const ctrl = form.control as TradeControl;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => onSubmit(v))}
          className="flex flex-col gap-4"
        >
          {/* Status badge (edit mode) */}
          {isEdit && (
            <div className="flex items-center justify-between">
              <StatusBadge status={status} outcome={trade.outcome} />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Pre-Trade Section */}
          <Collapsible open={preTradeSectionOpen} onOpenChange={setPreTradeSectionOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 py-2 text-left text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                {preTradeSectionOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Pre-Trade
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <PreTradeFields control={ctrl} />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Entry Section */}
          <Collapsible open={entrySectionOpen} onOpenChange={setEntrySectionOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 py-2 text-left text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                {entrySectionOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Entry
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <EntryFields control={ctrl} />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Post-Trade Section */}
          <Collapsible open={postTradeSectionOpen} onOpenChange={setPostTradeSectionOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 py-2 text-left text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                {postTradeSectionOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Post-Trade
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <PostTradeFields control={ctrl} />
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy ? 'Saving…' : 'Save'}
            </Button>

            {isEdit && status === 'pre_trade' && (
              <Button
                type="button"
                variant="secondary"
                disabled={isBusy}
                onClick={form.handleSubmit((v) => onSubmit(v, 'active'))}
              >
                Mark as Active
              </Button>
            )}

            {isEdit && status === 'active' && (
              <Button
                type="button"
                variant="secondary"
                disabled={isBusy}
                onClick={form.handleSubmit((v) => onSubmit(v, 'closed'))}
              >
                Close Trade
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trade</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trade? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (trade) deleteTrade.mutate(trade.id);
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
