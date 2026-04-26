import { useRef } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Trade, TradeCreate, TradeListResponse, TradeUpdate } from '@/types/api';

export interface TradeFilters {
  date_start?: string;
  date_end?: string;
  instrument?: string;
  session?: string;
  setup_type?: string;
  outcome?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export function useTrades(filters: TradeFilters = {}) {
  return useQuery({
    queryKey: ['trades', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
      return api.get('api/trades', { searchParams: params }).json<TradeListResponse>();
    },
    placeholderData: keepPreviousData,
  });
}

export function useTrade(id: string | undefined) {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: () => api.get(`api/trades/${id}`).json<Trade>(),
    enabled: !!id,
  });
}

export function useCreateTrade(navState?: Record<string, unknown>) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const navStateRef = useRef(navState);
  navStateRef.current = navState;
  return useMutation({
    mutationFn: (body: TradeCreate) =>
      api.post('api/trades', { json: body }).json<Trade>(),
    onSuccess: (trade) => {
      qc.invalidateQueries({ queryKey: ['trades'] });
      const state = navStateRef.current;
      navigate(`/trades/${trade.id}`, state != null ? { state } : undefined);
    },
  });
}

export function useUpdateTrade(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TradeUpdate) =>
      api.patch(`api/trades/${id}`, { json: body }).json<Trade>(),
    onSuccess: (updated) => {
      qc.setQueryData(['trade', id], updated);
      qc.invalidateQueries({ queryKey: ['trades'] });
    },
  });
}

export function useDeleteTrade() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => api.delete(`api/trades/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trades'] });
      navigate('/trades');
    },
  });
}
