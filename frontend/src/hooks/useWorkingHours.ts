import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface WorkingHour {
  id: number;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_day_off: boolean;
}

export interface EmployeeWorkingHours {
  id: number;
  name: string;
  working_hours: WorkingHour[];
}

export function useWorkingHours(businessId?: number) {
  return useQuery({
    queryKey: ['admin', businessId, 'working-hours'],
    queryFn: async () =>
      (
        await api.get<{ employees: EmployeeWorkingHours[] }>(
          `/admin/businesses/${businessId}/working-hours`
        )
      ).data.employees,
    enabled: !!businessId,
  });
}

export function useUpdateWorkingHours(businessId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      hours,
    }: {
      employeeId: number;
      hours: Array<{
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_day_off: boolean;
      }>;
    }) =>
      (
        await api.put(`/admin/businesses/${businessId}/working-hours/${employeeId}`, { hours })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', businessId, 'working-hours'] });
    },
  });
}
