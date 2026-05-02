import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { api } from '@/lib/api';
import type { BrokerCredentials, FillDTO, Trade } from '@/types/api';

// ============================================================
// Credentials
// ============================================================

export function useBrokerCredentials() {
  return useQuery<BrokerCredentials | null>({
    queryKey: ['tradovate', 'credentials'],
    queryFn: async () => {
      try {
        return await api.get('api/tradovate/credentials').json<BrokerCredentials>();
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 404) return null;
        throw e;
      }
    },
    staleTime: 60_000,
  });
}

export function useSaveBrokerToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      access_token,
      environment,
    }: {
      access_token: string;
      environment: 'demo' | 'live';
    }) =>
      api
        .post('api/tradovate/credentials/token', { json: { access_token, environment } })
        .json<BrokerCredentials>(),
    onSuccess: (data) => {
      qc.setQueryData(['tradovate', 'credentials'], data);
    },
  });
}

export function useTestBrokerCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post('api/tradovate/credentials/test').json<BrokerCredentials>(),
    onSuccess: (data) => {
      qc.setQueryData(['tradovate', 'credentials'], data);
    },
  });
}

export function useDeleteBrokerCredentials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete('api/tradovate/credentials'),
    onSuccess: () => {
      qc.setQueryData(['tradovate', 'credentials'], null);
    },
  });
}

// ============================================================
// Fills
// ============================================================

export function useFetchTradovateFills() {
  return useMutation({
    mutationFn: ({
      trade_date,
      instrument,
    }: {
      trade_date: string;
      instrument: string;
    }) => {
      const params = new URLSearchParams({ trade_date, instrument });
      return api.get('api/tradovate/fills', { searchParams: params }).json<FillDTO[]>();
    },
  });
}

// ============================================================
// Apply Fill
// ============================================================

export function useApplyTradovateFill(tradeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tradovate_fill_id,
      role,
    }: {
      tradovate_fill_id: number;
      role: 'entry' | 'exit';
    }) =>
      api
        .post(`api/trades/${tradeId}/apply-tradovate-fill`, {
          json: { tradovate_fill_id, role },
        })
        .json<Trade>(),
    onSuccess: (updatedTrade) => {
      qc.setQueryData(['trade', tradeId], updatedTrade);
      qc.invalidateQueries({ queryKey: ['trades'] });
    },
  });
}
