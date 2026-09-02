import { useEffect, useState } from 'react';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import { useBusinessSettings, useUpdateBusinessSettings } from '@/hooks/useAdminBusiness';

const timezones = [
  'Asia/Tehran',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
];

export default function SettingsPage() {
  const { data: business } = useMyBusiness();
  const { data: settings, isLoading } = useBusinessSettings(business?.id);
  const updateSettings = useUpdateBusinessSettings(business?.id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    timezone: 'Asia/Tehran',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name,
        description: settings.description ?? '',
        address: settings.address ?? '',
        phone: settings.phone ?? '',
        timezone: settings.timezone,
      });
    }
  }, [settings]);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    updateSettings.mutate(form);
  };

  if (isLoading) {
    return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">تنظیمات کسب‌وکار</h1>
        <p className="text-sm text-gray-500">ویرایش اطلاعات و تنظیمات کسب‌وکار شما</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">نام کسب‌وکار</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">توضیحات</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">آدرس</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">تلفن</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">منطقه زمانی</label>
          <select
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={updateSettings.isPending || !form.name.trim()}
            className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {updateSettings.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
          {updateSettings.isSuccess && (
            <span className="text-sm text-green-600">ذخیره شد ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
