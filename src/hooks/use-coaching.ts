import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { api } from '@/lib/api';
import type { CoachingEvent } from '@/types/api';

export function useLatestCoachingEvent() {
  return useQuery<CoachingEvent | null>({
    queryKey: ['coach', 'latest'],
    queryFn: async () => {
      try {
        return await api.get('api/coach/events/latest').json<CoachingEvent>();
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 404) return null;
        throw e;
      }
    },
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' ? 2000 : 10000,
  });
}

export function useCoachingEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['coach', 'event', id],
    queryFn: () => api.get(`api/coach/events/${id}`).json<CoachingEvent>(),
    enabled: !!id,
  });
}
