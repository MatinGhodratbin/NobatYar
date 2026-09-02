import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useDebounce } from './useDebounce';

export interface BusinessSummary {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logo_path: string | null;
}

export function useBusinessSearch(search: string) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: ['businesses', 'search', debouncedSearch],
    queryFn: async () =>
      (await api.get<{ data: BusinessSummary[] }>('/businesses', { params: { search: debouncedSearch || undefined } })).data,
  });
}

export function useBusinessBySlug(slug?: string) {
  return useQuery({
    queryKey: ['businesses', slug],
    queryFn: async () => (await api.get<{ business: BusinessSummary }>(`/businesses/${slug}`)).data.business,
    enabled: !!slug,
  });
}
