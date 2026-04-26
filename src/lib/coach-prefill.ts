import type { CoachingEvent } from '@/types/api';
import type { TradeFormValues } from '@/components/trade/trade-form';

type EtSession = 'london' | 'ny_am' | 'ny_pm' | 'off';

export function getCurrentEtSession(now: Date): EtSession {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const h = parseInt(parts.find((p) => p.type === 'hour')!.value, 10);
  const m = parseInt(parts.find((p) => p.type === 'minute')!.value, 10);
  const tod = h * 60 + m;

  if (tod >= 120 && tod < 300) return 'london';
  if (tod >= 510 && tod < 690) return 'ny_am';
  if (tod >= 810 && tod < 960) return 'ny_pm';
  return 'off';
}

export interface PrefillResult {
  values: Partial<TradeFormValues>;
  expandAdvanced: boolean;
  fieldNames: (keyof TradeFormValues)[];
}

export function extractPrefill(event: CoachingEvent | null, now: Date): PrefillResult | null {
  if (!event) { console.log('[coach-prefill] null event'); return null; }
  if (event.status !== 'complete') { console.log('[coach-prefill] status not complete:', event.status); return null; }

  const currentSession = getCurrentEtSession(now);
  console.log('[coach-prefill] currentSession:', currentSession, '| payload.session:', event.request_payload.session, '| tod:', (() => { const p = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(now); return parseInt(p.find(x=>x.type==='hour')!.value,10)*60+parseInt(p.find(x=>x.type==='minute')!.value,10); })());
  if (currentSession === 'off') { console.log('[coach-prefill] current session is off'); return null; }

  const payload = event.request_payload;
  const payloadSession = typeof payload.session === 'string' ? payload.session : null;
  if (payloadSession !== currentSession) { console.log('[coach-prefill] session mismatch — payload:', payloadSession, 'current:', currentSession); return null; }

  const values: Partial<TradeFormValues> = {};
  const fieldNames: (keyof TradeFormValues)[] = [];

  if (typeof payload.instrument === 'string' && payload.instrument) {
    values.instrument = payload.instrument;
    fieldNames.push('instrument');
  }

  if (typeof payload.session === 'string') {
    values.session = payload.session === 'off' ? null : payload.session;
    fieldNames.push('session');
  }

  if (typeof payload.htf_fvg_bias === 'string' && payload.htf_fvg_bias) {
    values.htf_bias = payload.htf_fvg_bias;
    fieldNames.push('htf_bias');
  }

  if (Array.isArray(payload.htf_fvg_range) && payload.htf_fvg_range.length >= 2) {
    const low = payload.htf_fvg_range[0];
    const high = payload.htf_fvg_range[1];
    if (typeof low === 'number') {
      values.htf_fvg_low = low;
      fieldNames.push('htf_fvg_low');
    }
    if (typeof high === 'number') {
      values.htf_fvg_high = high;
      fieldNames.push('htf_fvg_high');
    }
  }

  if (typeof payload.news_flag === 'boolean') {
    values.news_flag = payload.news_flag;
    fieldNames.push('news_flag');
  }

  const expandAdvanced = 'htf_fvg_low' in values || 'htf_fvg_high' in values;

  return { values, expandAdvanced, fieldNames };
}
