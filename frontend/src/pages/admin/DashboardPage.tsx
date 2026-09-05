import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import { useDashboard } from '@/hooks/useAdminBusiness';
import { EmployeeStatusList } from '@/components/admin/EmployeeStatusList';

function toRial(n: number) {
  return (n ?? 0).toLocaleString('fa-IR');
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const presets = [
  { label: '۷ روز اخیر', from: () => toISODate(new Date(Date.now() - 6 * 86400000)), to: () => toISODate(new Date()) },
  { label: '۳۰ روز اخیر', from: () => toISODate(new Date(Date.now() - 29 * 86400000)), to: () => toISODate(new Date()) },
  { label: 'این ماه', from: () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`; }, to: () => toISODate(new Date()) },
  { label: 'ماه گذشته', from: () => { const d = new Date(); d.setMonth(d.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`; }, to: () => { const d = new Date(); d.setDate(0); return toISODate(d); } },
];

export default function DashboardPage() {
  const { data: business } = useMyBusiness();
  const [from, setFrom] = useState(toISODate(new Date(Date.now() - 6 * 86400000)));
  const [to, setTo] = useState(toISODate(new Date()));
  const { data, isLoading, isError } = useDashboard(business?.id, { from, to });

  const applyPreset = (p: typeof presets[number]) => {
    setFrom(p.from());
    setTo(p.to());
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-100" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-red-600">خطا در دریافت آمار داشبورد.</div>;
  }

  const statCards = [
    { label: 'مجموع نوبت‌ها', value: data?.total_appointments ?? 0 },
    { label: 'درآمد', value: data ? `${toRial(data.monthly_revenue)} تومان` : '—' },
    { label: 'مشتریان جدید', value: data?.new_customers ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">خوش آمدید</h1>
        <p className="text-sm text-gray-500">نگاهی به عملکرد کسب‌وکار شما می‌اندازیم</p>
      </div>

      {/* فیلتر تاریخ */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
          />
          <span className="text-xs text-gray-400">تا</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <EmployeeStatusList businessId={business?.id} />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs text-gray-400">{card.label}</p>
              <p className="mt-1 text-lg font-bold text-gray-800">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-sm font-bold text-gray-700">توزیع خدمات</h2>
          {(data?.service_distribution.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-400">هنوز داده‌ای برای نمایش وجود ندارد.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.service_distribution} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="service_name" width={90} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => [`${value} نوبت`, 'تعداد']} />
                <Bar dataKey="total" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-sm font-bold text-gray-700">تحلیل درآمد</h2>
          {(data?.revenue_trend.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-400">هنوز داده‌ای برای نمایش وجود ندارد.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.revenue_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => [`${toRial(value)} تومان`, 'درآمد']} />
                <Line type="monotone" dataKey="total" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="mb-3 text-sm font-bold text-gray-700">نوبت‌های اخیر</h2>
        {(data?.recent_appointments.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-400">هنوز نوبتی ثبت نشده است.</p>
        ) : (
          <div className="space-y-2">
            {data?.recent_appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-gray-50 pb-2 text-sm">
                <span>{a.service.name}</span>
                <span className="text-gray-400">{a.employee.name}</span>
                <span className="text-xs text-gray-400">{a.start_time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
