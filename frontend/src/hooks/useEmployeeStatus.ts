import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { getEcho } from '@/lib/echo';

export interface EmployeeStatusItem {
  id: number;
  name: string;
  status: 'working' | 'resting' | 'off';
}

export function useEmployeeList(businessId?: number) {
  const [liveStatuses, setLiveStatuses] = useState<Record<number, string>>({});

  const query = useQuery({
    queryKey: ['admin', businessId, 'employees'],
    queryFn: async () =>
      (await api.get<{ data: EmployeeStatusItem[] } | EmployeeStatusItem[]>(
        `/admin/businesses/${businessId}/employees`
      )).data,
    enabled: !!businessId,
  });

  useEffect(() => {
    if (!businessId) return;

    const echo = getEcho();
    const channel = echo.private(`business.${businessId}.queue`);

    channel.listen('.employee.status.updated', (payload: { employee_id: number; status: string }) => {
      setLiveStatuses((prev) => ({ ...prev, [payload.employee_id]: payload.status }));
    });

    return () => {
      echo.leave(`business.${businessId}.queue`);
    };
  }, [businessId]);

  const raw = query.data;
  const employees: EmployeeStatusItem[] = Array.isArray(raw)
    ? raw
    : (raw as any)?.data ?? [];

  const merged = employees.map((e) => ({
    ...e,
    status: (liveStatuses[e.id] ?? e.status) as EmployeeStatusItem['status'],
  }));

  return { employees: merged, isLoading: query.isLoading };
}

export function useUpdateMyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'working' | 'resting' | 'off') =>
      (await api.patch('/my-employee/status', { status })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}