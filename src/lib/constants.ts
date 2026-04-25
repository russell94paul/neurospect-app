import type {
  SessionType,
  KillZoneType,
  BiasType,
  OppType,
  SetupType,
  PdaType,
  DisplacementType,
  OutcomeType,
  GradeType,
  ScreenshotPhase,
  TradeStatus,
  CoachBias,
  Confidence,
} from '@/types/api';

// ============================================================
// ENUM Label Maps  (snake_case → human-readable)
// ============================================================

export const SESSION_LABELS: Record<SessionType, string> = {
  asia: 'Asia',
  london: 'London',
  ny_am: 'NY AM',
  ny_pm: 'NY PM',
};

export const KILL_ZONE_LABELS: Record<KillZoneType, string> = {
  asia: 'Asia',
  london_open: 'London Open',
  ny_am_open: 'NY AM Open',
  ny_pm_open: 'NY PM Open',
  london_close: 'London Close',
};

export const BIAS_LABELS: Record<BiasType, string> = {
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
};

export const OPP_LABELS: Record<OppType, string> = {
  below_all: 'Below All',
  below_some: 'Below Some',
  above_all: 'Above All',
  above_some: 'Above Some',
};

export const SETUP_TYPE_LABELS: Record<SetupType, string> = {
  consolidation: 'Consolidation',
  expansion_retracement: 'Expansion Retracement',
  reversal: 'Reversal',
  model_2022_ote: 'Model 2022 OTE',
  london: 'London Model',
  daily_bias: 'Daily Bias',
  smt: 'SMT',
};

export const PDA_LABELS: Record<PdaType, string> = {
  fvg: 'FVG',
  order_block: 'Order Block',
  rejection_block: 'Rejection Block',
  ote_block: 'OTE Block',
  breaker: 'Breaker',
};

export const DISPLACEMENT_LABELS: Record<DisplacementType, string> = {
  clean: 'Clean',
  choppy: 'Choppy',
  none: 'None',
};

export const OUTCOME_LABELS: Record<OutcomeType, string> = {
  win: 'Win',
  loss: 'Loss',
  breakeven: 'Breakeven',
};

export const GRADE_LABELS: Record<GradeType, string> = {
  a_plus: 'A+',
  a: 'A',
  b: 'B',
  c: 'C',
};

export const SCREENSHOT_PHASE_LABELS: Record<ScreenshotPhase, string> = {
  before_entry: 'Before Entry',
  entry: 'Entry',
  higher_tf: 'Higher TF',
  exit: 'Exit',
  post_trade_review: 'Post-Trade Review',
};

export const TRADE_STATUS_LABELS: Record<TradeStatus, string> = {
  pre_trade: 'Pre-Trade',
  active: 'Active',
  closed: 'Closed',
};

// ============================================================
// {value, label}[] arrays for Select components
// ============================================================

export const SESSION_OPTIONS = (Object.keys(SESSION_LABELS) as SessionType[]).map((v) => ({
  value: v,
  label: SESSION_LABELS[v],
}));

export const KILL_ZONE_OPTIONS = (Object.keys(KILL_ZONE_LABELS) as KillZoneType[]).map((v) => ({
  value: v,
  label: KILL_ZONE_LABELS[v],
}));

export const BIAS_OPTIONS = (Object.keys(BIAS_LABELS) as BiasType[]).map((v) => ({
  value: v,
  label: BIAS_LABELS[v],
}));

export const OPP_OPTIONS = (Object.keys(OPP_LABELS) as OppType[]).map((v) => ({
  value: v,
  label: OPP_LABELS[v],
}));

export const SETUP_TYPE_OPTIONS = (Object.keys(SETUP_TYPE_LABELS) as SetupType[]).map((v) => ({
  value: v,
  label: SETUP_TYPE_LABELS[v],
}));

export const PDA_OPTIONS = (Object.keys(PDA_LABELS) as PdaType[]).map((v) => ({
  value: v,
  label: PDA_LABELS[v],
}));

export const DISPLACEMENT_OPTIONS = (Object.keys(DISPLACEMENT_LABELS) as DisplacementType[]).map(
  (v) => ({ value: v, label: DISPLACEMENT_LABELS[v] })
);

export const OUTCOME_OPTIONS = (Object.keys(OUTCOME_LABELS) as OutcomeType[]).map((v) => ({
  value: v,
  label: OUTCOME_LABELS[v],
}));

export const GRADE_OPTIONS = (Object.keys(GRADE_LABELS) as GradeType[]).map((v) => ({
  value: v,
  label: GRADE_LABELS[v],
}));

export const SCREENSHOT_PHASE_OPTIONS = (
  Object.keys(SCREENSHOT_PHASE_LABELS) as ScreenshotPhase[]
).map((v) => ({ value: v, label: SCREENSHOT_PHASE_LABELS[v] }));

export const TRADE_STATUS_OPTIONS = (Object.keys(TRADE_STATUS_LABELS) as TradeStatus[]).map(
  (v) => ({ value: v, label: TRADE_STATUS_LABELS[v] })
);

// ============================================================
// AI Coach constants
// ============================================================

export const COACH_BIAS_LABELS: Record<CoachBias, string> = {
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
  stand_aside: 'Stand Aside',
};

export const COACH_BIAS_STYLES: Record<CoachBias, string> = {
  bullish: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  bearish: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  stand_aside: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const CONFIDENCE_STYLES: Record<Confidence, string> = {
  high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export const STRATEGY_LABELS: Record<string, string> = {
  'consolidation-model': 'Consolidation Model',
  'expansion-retracement-model': 'Expansion & Retracement Model',
  'reversal-raid-on-stops': 'Reversal — Raid on Stops',
  'london-model': 'London Model',
  'model-2022-ote': 'Model 2022 (OTE)',
  'daily-bias-model': 'Daily Bias Model',
  'smt-confirmation-entry': 'SMT Confirmation Entry',
};

// ============================================================
// Common mistake tag suggestions
// ============================================================

export const COMMON_MISTAKE_TAGS = [
  'revenge',
  'fomo',
  'early_exit',
  'oversized',
  'wrong_session',
  'no_bias',
  'chased',
  'moved_stop',
];
