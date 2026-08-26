import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

interface CreateBusinessPayload {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}

interface CreateBusinessResponse {
  business: { id: number; name: string; slug: string };
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();
  const { user, token, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: CreateBusinessPayload) =>
      (await api.post<CreateBusinessResponse>('/business/onboarding', payload)).data,
    onSuccess: () => {
      // چون role کاربر روی بک‌اند به business_owner تغییر کرد، باید تو استور محلی هم به‌روز بشه
      if (user && token) {
        setAuth(token, { ...user, role: 'business_owner' });
      }
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
    },
  });
}