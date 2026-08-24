import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Service, Employee, AvailabilityResponse, Appointment } from '@/types';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => (await api.get<Service[]>('/services')).data,
  });
}

export function useEmployees(serviceId?: number) {
  return useQuery({
    queryKey: ['employees', serviceId],
    queryFn: async () =>
      (await api.get<Employee[]>('/employees', { params: { service_id: serviceId } })).data,
    enabled: !!serviceId,
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