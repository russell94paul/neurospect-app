// ============================================================
// ENUM Types (mirror backend app/models/enums.py)
// ============================================================

export type SessionType = 'asia' | 'london' | 'ny_am' | 'ny_pm';

export type KillZoneType = 'asia' | 'london_open' | 'ny_am_open' | 'ny_pm_open' | 'london_close';

export type BiasType = 'bullish' | 'bearish' | 'neutral';

export type OppType = 'below_all' | 'below_some' | 'above_all' | 'above_some';

export type SetupType =
  | 'consolidation'
  | 'expansion_retracement'
  | 'reversal'
  | 'model_2022_ote'
  | 'london'
  | 'daily_bias'
  | 'smt';

export type PdaType = 'fvg' | 'order_block' | 'rejection_block' | 'ote_block' | 'breaker';

export type DisplacementType = 'clean' | 'choppy' | 'none';

export type OutcomeType = 'win' | 'loss' | 'breakeven';

export type GradeType = 'a_plus' | 'a' | 'b' | 'c';

export type ScreenshotPhase =
  | 'before_entry'
  | 'entry'
  | 'higher_tf'
  | 'exit'
  | 'post_trade_review';

export type TradeStatus = 'pre_trade' | 'active' | 'closed';

// ============================================================
// Auth
// ============================================================

export interface User {
  id: string;
  discord_id: string;
  discord_username: string | null;
  discord_avatar_url: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ============================================================
// Trade schemas (mirror backend app/schemas/trade.py)
// ============================================================

export interface TradeCreate {
  trade_date: string; // ISO date string "YYYY-MM-DD"
  instrument: string;
  session?: SessionType | null;
  kill_zone?: KillZoneType | null;
  htf_bias?: BiasType | null;
  htf_fvg_low?: number | null;
  htf_fvg_high?: number | null;
  draw_on_liquidity?: string | null;
  dol_price_level?: number | null;
  opening_price_position?: OppType | null;
  news_flag?: boolean;
  setup_type?: SetupType | null;
  narrative?: string | null;
  entry_price?: number | null;
  entry_time?: string | null;
  position_size?: number | null;
  stop_price?: number | null;
  stop_logic?: string | null;
  target_price?: number | null;
  target_logic?: string | null;
  entry_pda?: PdaType | null;
  displacement_quality?: DisplacementType | null;
  smt_confirmation?: boolean | null;
}

export interface TradeUpdate {
  trade_date?: string | null;
  instrument?: string | null;
  session?: SessionType | null;
  kill_zone?: KillZoneType | null;
  htf_bias?: BiasType | null;
  htf_fvg_low?: number | null;
  htf_fvg_high?: number | null;
  draw_on_liquidity?: string | null;
  dol_price_level?: number | null;
  opening_price_position?: OppType | null;
  news_flag?: boolean | null;
  setup_type?: SetupType | null;
  narrative?: string | null;
  entry_price?: number | null;
  entry_time?: string | null;
  position_size?: number | null;
  stop_price?: number | null;
  stop_logic?: string | null;
  target_price?: number | null;
  target_logic?: string | null;
  entry_pda?: PdaType | null;
  displacement_quality?: DisplacementType | null;
  smt_confirmation?: boolean | null;
  exit_price?: number | null;
  exit_time?: string | null;
  outcome?: OutcomeType | null;
  r_multiple?: number | null;
  mae?: number | null;
  mfe?: number | null;
  target_reached?: boolean | null;
  plan_followed?: boolean | null;
  mistake_tags?: string[] | null;
  quality_grade?: GradeType | null;
  post_trade_notes?: string | null;
  status?: TradeStatus | null;
}

export interface Trade {
  id: string;
  user_id: string;
  trade_date: string;
  instrument: string;
  session: SessionType | null;
  kill_zone: KillZoneType | null;
  htf_bias: BiasType | null;
  htf_fvg_low: number | null;
  htf_fvg_high: number | null;
  draw_on_liquidity: string | null;
  dol_price_level: number | null;
  opening_price_position: OppType | null;
  news_flag: boolean;
  setup_type: SetupType | null;
  narrative: string | null;
  entry_price: number | null;
  entry_time: string | null;
  position_size: number | null;
  stop_price: number | null;
  stop_logic: string | null;
  target_price: number | null;
  target_logic: string | null;
  entry_pda: PdaType | null;
  displacement_quality: DisplacementType | null;
  smt_confirmation: boolean | null;
  exit_price: number | null;
  exit_time: string | null;
  outcome: OutcomeType | null;
  r_multiple: number | null;
  mae: number | null;
  mfe: number | null;
  target_reached: boolean | null;
  plan_followed: boolean | null;
  mistake_tags: string[] | null;
  quality_grade: GradeType | null;
  post_trade_notes: string | null;
  status: TradeStatus;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface TradeListResponse {
  items: Trade[];
  total: number;
  page: number;
  page_size: number;
}

// ============================================================
// Screenshot (mirror backend app/schemas/screenshot.py)
// ============================================================

export interface Screenshot {
  id: string;
  trade_id: string;
  user_id: string;
  phase: ScreenshotPhase;
  storage_key: string;
  original_filename: string | null;
  content_type: string | null;
  uploaded_at: string;
  presigned_url: string | null;
}

// ============================================================
// Analytics (mirror backend app/schemas/analytics.py)
// ============================================================

export interface SummaryStats {
  total_trades: number;
  closed_trades: number;
  win_rate: number | null;
  avg_r_multiple: number | null;
  best_setup_type: string | null;
  current_win_streak: number;
  current_loss_streak: number;
  longest_win_streak: number;
  longest_loss_streak: number;
}

export interface BreakdownRow {
  group: string;
  total: number;
  wins: number;
  losses: number;
  breakevens: number;
  win_rate: number | null;
  avg_r_multiple: number | null;
}

export interface DayOfWeekRow {
  day_of_week: number;
  day_name: string;
  total: number;
  wins: number;
  losses: number;
  breakevens: number;
  win_rate: number | null;
  avg_r_multiple: number | null;
}

export interface MistakeRow {
  tag: string;
  count: number;
}

export interface RBucket {
  bucket: number;
  r_low: number;
  r_high: number;
  count: number;
}

// ============================================================
// AI Coach types
// ============================================================

export type CoachBias = 'bullish' | 'bearish' | 'neutral' | 'stand_aside';
export type Confidence = 'high' | 'medium' | 'low';
export type CoachingEventStatus = 'pending' | 'complete' | 'error';

export interface ChecklistItem {
  id: string;
  met: boolean;
  note: string;
}

export interface ValidStrategy {
  strategy_id: string;
  confidence: Confidence;
  checklist: ChecklistItem[];
  missing: string[];
  watch_for: string;
}

export interface Layer3Response {
  bias: CoachBias;
  narrative: string;
  valid_strategies: ValidStrategy[];
  invalid_strategies: string[];
  alerts: string[];
}

export interface CoachingEvent {
  id: string;
  status: CoachingEventStatus;
  instrument: string;
  alert_timestamp: string;
  request_payload: Record<string, unknown>;
  response_payload: Record<string, unknown> | null;
  error_message: string | null;
  claude_latency_ms: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface TvTokenResponse {
  token: string;
  webhook_url: string;
  created_at: string;
}
