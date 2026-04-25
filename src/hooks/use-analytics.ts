import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  BreakdownRow,
  DayOfWeekRow,
  MistakeRow,
  RBucket,
  SummaryStats,
} from '@/types/api';

const STALE = 5 * 60 * 1000;

export const useSummary = () =>
  useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => api.get('api/analytics/summary').json<SummaryStats>(),
    staleTime: STALE,
  });

export const useBySetup = () =>
  useQuery({
    queryKey: ['analytics', 'by-setup'],
    queryFn: () =>
      api.get('api/analytics/by-setup').json<{ rows: BreakdownRow[] }>().then((r) => r.rows),
    staleTime: STALE,
  });

export const useBySession = () =>
  useQuery({
    queryKey: ['analytics', 'by-session'],
    queryFn: () =>
      api.get('api/analytics/by-session').json<{ rows: BreakdownRow[] }>().then((r) => r.rows),
    staleTime: STALE,
  });

export const useByInstrument = () =>
  useQuery({
    queryKey: ['analytics', 'by-instrument'],
    queryFn: () =>
      api
        .get('api/analytics/by-instrument')
        .json<{ rows: BreakdownRow[] }>()
        .then((r) => r.rows),
    staleTime: STALE,
  });

export const useByDayOfWeek = () =>
  useQuery({
    queryKey: ['analytics', 'by-day-of-week'],
    queryFn: () =>
      api
        .get('api/analytics/by-day-of-week')
        .json<{ rows: DayOfWeekRow[] }>()
        .then((r) => r.rows),
    staleTime: STALE,
  });

export const useMistakes = () =>
  useQuery({
    queryKey: ['analytics', 'mistakes'],
    queryFn: () =>
      api.get('api/analytics/mistakes').json<{ rows: MistakeRow[] }>().then((r) => r.rows),
    staleTime: STALE,
  });

export const useRDistribution = () =>
  useQuery({
    queryKey: ['analytics', 'r-distribution'],
    queryFn: () =>
      api
        .get('api/analytics/r-distribution')
        .json<{ buckets: RBucket[] }>()
        .then((r) => r.buckets),
    staleTime: STALE,
  });
