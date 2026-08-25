import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface AdminDashboard {
  total_appointments: number;
  monthly_revenue: number;
  new_customers: number;
  service_distribution: Array<{ service_name: string; total: number }>;
  revenue_trend: Array<{ day: string; total: number }>;
  recent_appointments: Array<{
    id: number;
    code: string;
    status: string;
    start_time: string;
    service: { name: string };
    employee: { name: string };
  }>;
}

export function useDashboard(businessId?: number) {
  return useQuery({
    queryKey: ['admin', businessId, 'dashboard'],
    queryFn: async () => (await api.get<AdminDashboard>(`/admin/businesses/${businessId}/dashboard`)).data,
    enabled: !!businessId,
  });
}

export interface AdminAppointment {
  id: number;
  code: string;
  status: string;
  appointment_date: string;
  start_time: string;
  price: number;
  service: { name: string };
  employee: { name: string };
  business: { name: string };
}

export function useAdminAppointments(
  businessId?: number,
  filters?: { status?: string; date?: string; search?: string }
) {
  return useQuery({
    queryKey: ['admin', businessId, 'appointments', filters],
    queryFn: async () =>
      (
        await api.get<{ data: AdminAppointment[] }>(`/admin/businesses/${businessId}/appointments`, {
          params: filters,
        })
      ).data,
    enabled: !!businessId,
  });
}

export function useUpdateAppointmentStatus(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, status }: { appointmentId: number; status: string }) =>
      (
        await api.patch(`/admin/businesses/${businessId}/appointments/${appointmentId}/status`, {
          status,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'appointments'] });
    },
  });
}