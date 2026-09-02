import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) =>
      (await api.post(`/booking/appointments/${appointmentId}/cancel`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}
