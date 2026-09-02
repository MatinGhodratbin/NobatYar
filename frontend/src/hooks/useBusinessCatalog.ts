import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useDebounce } from './useDebounce';
import type { PaginatedResponse } from './useAdminBusiness';

export interface BusinessSummary {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logo_path: string | null;
}

export function useBusinessSearch(search: string, page = 1) {
  const debouncedSearch = useDebounce(search, 300);

  return useQuery({
    queryKey: ['businesses', 'search', debouncedSearch, page],
    queryFn: async () =>
      (
        await api.get<PaginatedResponse<BusinessSummary>>('/businesses', {
          params: { search: debouncedSearch || undefined, page },
        })
      ).data,
  });
}

export function useBusinessBySlug(slug?: string) {
  return useQuery({
    queryKey: ['businesses', slug],
    queryFn: async () => (await api.get<{ business: BusinessSummary }>(`/businesses/${slug}`)).data.business,
    enabled: !!slug,
  });
}
