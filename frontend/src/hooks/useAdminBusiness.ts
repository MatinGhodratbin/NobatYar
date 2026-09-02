import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useDebounce } from './useDebounce';

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
  customer?: { name: string; phone: string };
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function useAdminAppointments(
  businessId?: number,
  filters?: { status?: string; date?: string; search?: string; page?: number }
) {
  const debouncedSearch = useDebounce(filters?.search, 300);

  return useQuery({
    queryKey: ['admin', businessId, 'appointments', { ...filters, search: debouncedSearch }],
    queryFn: async () =>
      (
        await api.get<PaginatedResponse<AdminAppointment>>(
          `/admin/businesses/${businessId}/appointments`,
          {
            params: {
              status: filters?.status || undefined,
              date: filters?.date || undefined,
              search: debouncedSearch || undefined,
              page: filters?.page || 1,
            },
          }
        )
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

// --- Services ---

export interface AdminService {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export function useAdminServices(businessId?: number) {
  return useQuery({
    queryKey: ['admin', businessId, 'services'],
    queryFn: async () =>
      (await api.get<{ data: AdminService[] }>(`/admin/businesses/${businessId}/services`)).data.data,
    enabled: !!businessId,
  });
}

export function useCreateService(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      description?: string;
      duration_minutes: number;
      price: number;
      is_active?: boolean;
    }) =>
      (
        await api.post(`/admin/businesses/${businessId}/services`, payload)
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'services'] });
    },
  });
}

export function useUpdateService(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      ...payload
    }: {
      serviceId: number;
      name: string;
      description?: string;
      duration_minutes: number;
      price: number;
      is_active?: boolean;
    }) =>
      (
        await api.put(`/admin/businesses/${businessId}/services/${serviceId}`, payload)
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'services'] });
    },
  });
}

export function useDeleteService(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: number) =>
      (await api.delete(`/admin/businesses/${businessId}/services/${serviceId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'services'] });
    },
  });
}

// --- Employees ---

export interface AdminEmployee {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  is_active: boolean;
  status: string;
  services: string[];
}

export function useAdminEmployees(businessId?: number) {
  return useQuery({
    queryKey: ['admin', businessId, 'employees'],
    queryFn: async () =>
      (await api.get<{ data: AdminEmployee[] }>(`/admin/businesses/${businessId}/employees`)).data.data,
    enabled: !!businessId,
  });
}

export function useCreateEmployee(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone?: string;
      position?: string;
      service_ids?: number[];
    }) =>
      (await api.post(`/admin/businesses/${businessId}/employees`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'employees'] });
    },
  });
}

export function useDeleteEmployee(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) =>
      (await api.delete(`/admin/businesses/${businessId}/employees/${employeeId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'employees'] });
    },
  });
}

// --- Settings ---

export interface BusinessSettings {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  timezone: string;
  is_active: boolean;
}

export function useBusinessSettings(businessId?: number) {
  return useQuery({
    queryKey: ['admin', businessId, 'settings'],
    queryFn: async () =>
      (
        await api.get<{ business: BusinessSettings }>(
          `/admin/businesses/${businessId}/settings`
        )
      ).data.business,
    enabled: !!businessId,
  });
}

export function useUpdateBusinessSettings(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name?: string;
      description?: string;
      address?: string;
      phone?: string;
      timezone?: string;
    }) =>
      (
        await api.put(`/admin/businesses/${businessId}/settings`, payload)
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
    },
  });
}
