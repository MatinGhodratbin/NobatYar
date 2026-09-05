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

export interface AppointmentDetail {
  id: number;
  code: string;
  status: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  price: number;
  service: { id: number; name: string; duration_minutes: number };
  employee: { id: number; name: string; position: string | null };
  business: { id: number; name: string };
}

export function useLiveQueue(appointmentId?: number) {
  const [liveStatus, setLiveStatus] = useState<QueueStatus | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const initialQuery = useQuery({
    queryKey: ['queue', appointmentId],
    queryFn: async () => (await api.get<QueueStatus>(`/booking/appointments/${appointmentId}/queue`)).data,
    enabled: !!appointmentId,
  });

  const appointmentQuery = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => (await api.get<{ appointment: AppointmentDetail }>(`/booking/appointments/${appointmentId}/queue`)).data,
    enabled: !!appointmentId,
  });

  useEffect(() => {
    if (!appointmentId) return;

    const echo = getEcho();
    const channel = echo.private(`appointment.${appointmentId}`);

    channel.listen('.queue.updated', (payload: QueueStatus) => {
      setLiveStatus(payload);
    });

    channel.listen('.reminder.due', (payload: { message: string }) => {
      setReminderMessage(payload.message);
    });

    return () => {
      echo.leave(`appointment.${appointmentId}`);
    };
  }, [appointmentId]);

  return {
    status: liveStatus ?? initialQuery.data ?? null,
    appointment: (appointmentQuery.data as any)?.appointment ?? null,
    reminderMessage,
    isLoading: initialQuery.isLoading,
    isError: initialQuery.isError,
    refetch: initialQuery.refetch,
  };
}