import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { api } from '@/lib/api';
import type { TvTokenResponse } from '@/types/api';

export function useTvToken() {
  return useQuery<TvTokenResponse | null>({
    queryKey: ['coach', 'tv-token'],
    queryFn: async () => {
      try {
        return await api.get('api/coach/tv-token').json<TvTokenResponse>();
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 404) return null;
        throw e;
      }
    },
  });
}

export function useRotateTvToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('api/coach/tv-token').json<TvTokenResponse>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coach', 'tv-token'] });
    },
  });
}

export function useRevokeTvToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete('api/coach/tv-token'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coach', 'tv-token'] });
    },
  });
}
