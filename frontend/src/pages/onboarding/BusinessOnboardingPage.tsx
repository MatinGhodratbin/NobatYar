import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBusiness } from '@/hooks/useBusinessOnboarding';

export default function BusinessOnboardingPage() {
  const navigate = useNavigate();
  const createBusiness = useCreateBusiness();
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    createBusiness.mutate(form, {
      onSuccess: () => navigate('/admin'),
      onError: (err: any) => {
        setError(err?.response?.data?.message ?? 'ثبت کسب‌وکار با خطا مواجه شد.');
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-primary-600 text-center">ساخت کسب‌وکار شما</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          اطلاعات پایه کسب‌وکارتان را وارد کنید تا پنل مدیریت برایتان فعال شود.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">نام کسب‌وکار</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="مثلاً پیرایش مدرن"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">توضیحات (اختیاری)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              rows={2}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">آدرس (اختیاری)</label>
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">تلفن (اختیاری)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={createBusiness.isPending}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {createBusiness.isPending ? 'در حال ثبت...' : 'ساخت کسب‌وکار و ورود به پنل'}
          </button>
        </form>
      </div>
    </div>
  );
}