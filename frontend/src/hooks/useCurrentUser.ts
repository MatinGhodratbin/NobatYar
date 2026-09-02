import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

export function useCurrentUser() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => (await api.get<{ user: User }>('/auth/user')).data.user,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
