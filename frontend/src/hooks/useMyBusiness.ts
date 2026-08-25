import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export function useMyBusiness() {
  return useQuery({
    queryKey: ['my-business'],
    queryFn: async () =>
      (await api.get<{ business: { id: number; name: string } }>('/my-business')).data.business,
  });
}