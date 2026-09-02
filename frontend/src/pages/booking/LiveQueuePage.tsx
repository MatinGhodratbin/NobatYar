import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQueue } from '@/hooks/useLiveQueue';
import { useCancelAppointment } from '@/hooks/useCancelAppointment';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
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
  const cancelAppointment = useCancelAppointment();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
    return <CompletedState onBackHome={() => navigate('/search')} />;
  }

  if (status.status === 'cancelled') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">نوبت لغو شده</h1>
          <p className="mt-2 text-sm text-gray-500">نوبت شما با موفقیت لغو شد.</p>
          <button
            onClick={() => navigate('/search')}
            className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const currentStep = stepIndex(status.status);

  const handleCancel = () => {
    if (!appointmentId) return;
    cancelAppointment.mutate(Number(appointmentId), {
      onSuccess: () => {
        setShowCancelConfirm(false);
        refetch();
      },
    });
  };

  const canCancel = ['pending', 'confirmed', 'in_queue'].includes(status.status);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 text-xl font-bold text-gray-900">صف زنده نوبت</h1>

        {/* کارت وضعیت اصلی */}
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

        {/* تایم‌لاین */}
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

        {/* دکمه لغو */}
        {canCancel && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="mt-6 w-full rounded-lg border border-red-200 bg-white py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            لغو نوبت
          </button>
        )}
      </div>

      {reminderMessage && (
        <div className="fixed bottom-6 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 shadow-lg text-center">
          <p className="text-sm text-amber-800">{reminderMessage}</p>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showCancelConfirm}
        title="لغو نوبت"
        message="آیا از لغو این نوبت اطمینان دارید؟ این عمل قابل بازگشت نیست."
        confirmLabel={cancelAppointment.isPending ? 'در حال لغو...' : 'بله، لغو شود'}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
        isLoading={cancelAppointment.isPending}
      />
    </div>
  );
}
