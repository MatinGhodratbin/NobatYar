import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Service, Employee, AvailabilityResponse, Appointment } from '@/types';

export function useServices(businessSlug?: string, search?: string) {
  return useQuery({
    queryKey: ['services', businessSlug, search],
    queryFn: async () =>
      (
        await api.get<Service[]>('/services', {
          params: { business_slug: businessSlug, search: search || undefined },
        })
      ).data,
    enabled: !!businessSlug,
  });
}

export function useEmployees(businessSlug?: string, serviceId?: number) {
  return useQuery({
    queryKey: ['employees', businessSlug, serviceId],
    queryFn: async () =>
      (
        await api.get<Employee[]>('/employees', {
          params: { business_slug: businessSlug, service_id: serviceId },
        })
      ).data,
    enabled: !!businessSlug && !!serviceId,
  });
}

export function useAvailability(employeeId?: number, serviceId?: number, date?: string) {
  return useQuery({
    queryKey: ['availability', employeeId, serviceId, date],
    queryFn: async () =>
      (
        await api.get<AvailabilityResponse>('/booking/availability', {
          params: { employee_id: employeeId, service_id: serviceId, date },
        })
      ).data,
    enabled: !!employeeId && !!serviceId && !!date,
  });
}

interface CreateAppointmentPayload {
  employee_id: number;
  service_id: number;
  date: string;
  start_time: string;
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: async (payload: CreateAppointmentPayload) =>
      (await api.post<{ appointment: Appointment }>('/booking/appointments', payload)).data,
  });
}