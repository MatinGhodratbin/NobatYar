import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQueue } from '@/hooks/useLiveQueue';
import { CompletedState } from '@/components/booking/CompletedState';

const statusLabels: Record<string, string> = {
  pending: 'در انتظار تایید',
  confirmed: 'تایید شده',
  in_queue: 'در صف انتظار',
  in_progress: 'در حال دریافت خدمت',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

const timelineSteps = [
  { key: 'pending', label: 'نوبت ثبت شد' },
  { key: 'confirmed', label: 'تایید شد' },
  { key: 'in_queue', label: 'در صف انتظار' },
  { key: 'in_progress', label: 'شروع سرویس' },
  { key: 'completed', label: 'اتمام سرویس' },
];

function stepIndex(status: string) {
  return timelineSteps.findIndex((s) => s.key === status);
}

export default function LiveQueuePage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { status, reminderMessage, isLoading, isError, refetch } = useLiveQueue(
    appointmentId ? Number(appointmentId) : undefined
  );

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">در حال بارگذاری...</div>;
  }

  if (isError || !status) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-sm text-red-600">خطا در دریافت وضعیت صف.</p>
        <button onClick={() => refetch()} className="text-sm text-primary-600 underline">
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (status.status === 'completed') {
    return <CompletedState onBackHome={() => navigate('/booking')} />;
  }

  const currentStep = stepIndex(status.status);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 text-xl font-bold text-gray-900">صف زنده نوبت</h1>

        {/* کارت وضعیت اصلی — طبق اصلاح موبایل باید بالای صفحه و کاملاً واضح باشد */}
        <div className="rounded-xl bg-primary-600 p-5 text-white">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            {statusLabels[status.status]}
          </span>
          <p className="mt-3 text-lg font-bold">
            {status.estimated_minutes > 0
              ? `حدود ${status.estimated_minutes} دقیقه دیگر`
              : 'نوبت شما نزدیک است'}
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-white/20">
            <div
              className="h-2 rounded-full bg-white transition-all"
              style={{ width: `${status.progress_percent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-gray-100 bg-white p-3 text-center">
            <p className="text-xs text-gray-400">نفرات جلوتر</p>
            <p className="mt-1 font-bold text-gray-800">{status.people_ahead} نفر</p>
          </div>
        </div>

        {/* تایم‌لاین — نسخه‌ی موبایل جمع‌وجورتر (فاصله کمتر، بدون توضیح اضافه) */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-3 text-sm font-bold text-gray-700">تاریخچه مراحل</h2>
          <div className="space-y-3">
            {timelineSteps.map((step, idx) => (
              <div key={step.key} className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    idx <= currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
                <span className={`text-sm ${idx <= currentStep ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {reminderMessage && (
        <div className="fixed bottom-6 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 shadow-lg text-center">
          <p className="text-sm text-amber-800">{reminderMessage}</p>
      </div>
      )}
    </div>
  );
}