import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyAppointments, type CustomerAppointment } from '@/hooks/useMyAppointments';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';

function toRial(n: number) {
  return n.toLocaleString('fa-IR');
}

const statusLabel: Record<string, string> = {
  pending: 'در انتظار تایید',
  confirmed: 'تایید شده',
  in_queue: 'در صف',
  in_progress: 'در حال انجام',
  completed: 'انجام شده',
  cancelled: 'لغو شده',
};

export default function MyAppointmentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyAppointments(page);

  const appointments = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">نوبت‌های من</h1>
          <p className="text-sm text-gray-500">لیست نوبت‌های رزرو شده شما</p>
        </div>

        {isLoading && <div className="text-sm text-gray-400">در حال بارگذاری...</div>}

        {!isLoading && appointments.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm font-medium text-gray-600">هنوز نوبتی رزرو نکرده‌اید</p>
            <Link
              to="/search"
              className="mt-3 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              جستجوی کسب‌وکار
            </Link>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500">{a.code}</span>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">{a.business.name}</p>
                <p className="text-sm text-gray-600">{a.service.name}</p>
                <p className="text-xs text-gray-400">
                  {a.employee.name} · {a.appointment_date} · {a.start_time}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary-600">
                    {toRial(a.price)} تومان
                  </span>
                  {['pending', 'confirmed'].includes(a.status) && (
                    <Link
                      to={`/booking/queue/${a.id}`}
                      className="text-xs font-medium text-primary-600 hover:underline"
                    >
                      مشاهده صف
                    </Link>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  وضعیت: {statusLabel[a.status] ?? a.status}
                </p>
              </div>
            ))}
          </div>
        )}

        {meta && <Pagination meta={meta} onPageChange={setPage} />}
      </div>
    </div>
  );
}
