import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessSearch } from '@/hooks/useBusinessCatalog';
import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/ui/Avatar';

export default function BusinessSearchPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useBusinessSearch(search);

  const businesses = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearch} searchPlaceholder="جستجوی نام سالن یا کسب‌وکار..." />

      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900">کسب‌وکار مورد نظرتان را پیدا کنید</h1>
        <p className="mt-1 text-sm text-gray-500">برای شروع رزرو نوبت، یکی از کسب‌وکارهای زیر را انتخاب کنید.</p>

        {isLoading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && businesses.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm font-medium text-gray-600">
              {search ? `هیچ کسب‌وکاری با عبارت «${search}» یافت نشد.` : 'در حال حاضر کسب‌وکاری ثبت نشده است.'}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {businesses.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/b/${b.slug}/booking`)}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-right hover:border-primary-200 transition"
            >
              <Avatar name={b.name} imageUrl={b.logo_path} size="lg" />
              <div>
                <p className="font-medium text-gray-800">{b.name}</p>
                {b.address && <p className="text-xs text-gray-400">{b.address}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}