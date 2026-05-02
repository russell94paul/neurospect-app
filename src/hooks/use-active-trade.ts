import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Trade, TradeListResponse } from '@/types/api';

export function useActiveTrade(): Trade | null {
  const { data } = useQuery({
    queryKey: ['trades', { status: 'active', page_size: 1 }],
    queryFn: () => {
      const params = new URLSearchParams({ status: 'active', page_size: '1' });
      return api.get('api/trades', { searchParams: params }).json<TradeListResponse>();
    },
    staleTime: 30_000,
  });
  return data?.items?.[0] ?? null;
}
