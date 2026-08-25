import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import { useDashboard } from '@/hooks/useAdminBusiness';

function toRial(n: number) {
  return n.toLocaleString('fa-IR');
}

const statCards = (data: ReturnType<typeof useDashboard>['data']) => [
  { label: 'مجموع نوبت‌ها', value: data?.total_appointments ?? 0 },
  { label: 'درآمد ماهانه', value: data ? `${toRial(data.monthly_revenue)} تومان` : '—' },
  { label: 'مشتریان جدید', value: data?.new_customers ?? 0 },
];

export default function DashboardPage() {
  const { data: business } = useMyBusiness();
  const { data, isLoading, isError } = useDashboard(business?.id);

  if (isLoading) {
    return <div className="text-sm text-gray-400">در حال بارگذاری آمار...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-600">خطا در دریافت آمار داشبورد.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">خوش آمدید</h1>
        <p className="text-sm text-gray-500">نگاهی به عملکرد امروز کسب‌وکار شما می‌اندازیم</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards(data).map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="text-xs text-gray-400">{card.label}</p>
            <p className="mt-1 text-lg font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
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
                <Tooltip formatter={(value: number) => [`${value} نوبت`, 'تعداد']} />
                <Bar dataKey="total" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-sm font-bold text-gray-700">تحلیل درآمد (۷ روز اخیر)</h2>
          {(data?.revenue_trend.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-400">هنوز داده‌ای برای نمایش وجود ندارد.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.revenue_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [`${toRial(value)} تومان`, 'درآمد']} />
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