import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Screenshot, ScreenshotPhase } from '@/types/api';

export function useScreenshots(tradeId: string | undefined) {
  return useQuery({
    queryKey: ['screenshots', tradeId],
    queryFn: () => api.get(`api/trades/${tradeId}/screenshots`).json<Screenshot[]>(),
    enabled: !!tradeId,
    staleTime: 30 * 60 * 1000,
  });
}

export function useUploadScreenshot(tradeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, phase }: { file: File; phase: ScreenshotPhase }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('phase', phase);
      return api.post(`api/trades/${tradeId}/screenshots`, { body: form }).json<Screenshot>();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['screenshots', tradeId] });
    },
  });
}

export function useDeleteScreenshot(tradeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (screenshotId: string) =>
      api.delete(`api/trades/${tradeId}/screenshots/${screenshotId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['screenshots', tradeId] });
    },
  });
}
