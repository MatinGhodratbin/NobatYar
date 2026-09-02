import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) =>
      (await api.post<AuthResponse>('/auth/login', payload)).data,
    onSuccess: (data) => setAuth(data.token, data.user),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => (await api.post<AuthResponse>('/auth/register', payload)).data,
    onSuccess: (data) => setAuth(data.token, data.user),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) =>
      (await api.post<{ message: string }>('/auth/forgot-password', payload)).data,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      password_confirmation: string;
      token: string;
    }) => (await api.post<{ message: string }>('/auth/reset-password', payload)).data,
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async () =>
      (await api.post<{ message: string }>('/auth/email/resend')).data,
  });
}