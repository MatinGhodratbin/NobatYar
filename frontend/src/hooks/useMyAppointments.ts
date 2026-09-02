import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { PaginatedResponse } from './useAdminBusiness';

export interface CustomerAppointment {
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

export function useMyAppointments(page = 1) {
  return useQuery({
    queryKey: ['my-appointments', page],
    queryFn: async () =>
      (
        await api.get<PaginatedResponse<CustomerAppointment>>('/booking/my-appointments', {
          params: { page },
        })
      ).data,
  });
}
