import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { getEcho } from '@/lib/echo';

export interface QueueStatus {
  appointment_id: number;
  status: string;
  people_ahead: number;
  estimated_minutes: number;
  progress_percent: number;
}

export function useLiveQueue(appointmentId?: number) {
  const [liveStatus, setLiveStatus] = useState<QueueStatus | null>(null);

  const initialQuery = useQuery({
    queryKey: ['queue', appointmentId],
    queryFn: async () => (await api.get<QueueStatus>(`/booking/appointments/${appointmentId}/queue`)).data,
    enabled: !!appointmentId,
  });

  useEffect(() => {
    if (!appointmentId) return;

    const echo = getEcho();
    const channel = echo.private(`appointment.${appointmentId}`);

    channel.listen('.queue.updated', (payload: QueueStatus) => {
      setLiveStatus(payload);
    });

    return () => {
      echo.leave(`appointment.${appointmentId}`);
    };
  }, [appointmentId]);

  return {
    status: liveStatus ?? initialQuery.data ?? null,
    isLoading: initialQuery.isLoading,
    isError: initialQuery.isError,
    refetch: initialQuery.refetch,
  };
}