import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAvailability, useCreateAppointment } from '@/hooks/useBookingData';
import { useBookingStore } from '@/store/bookingStore';
import { StepIndicator } from '@/components/booking/StepIndicator';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { Calendar } from '@/components/booking/Calendar';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { NoSlotsState, NetworkErrorToast } from '@/components/booking/EmptyStates';
import { Avatar } from '@/components/ui/Avatar';
import type { TimeSlot } from '@/types';

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DateTimeSelectionPage() {
  const navigate = useNavigate();
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const { service, employee, date, slot, setDateSlot } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<string>(date ?? toISODate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(slot);
  const [networkError, setNetworkError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, isError, refetch } = useAvailability(employee?.id, service?.id, selectedDate);
  const createAppointment = useCreateAppointment();

  useEffect(() => {
    if (!service || !employee) {
      navigate(`/b/${businessSlug}/booking`, { replace: true });
    }
  }, [service, employee, navigate, businessSlug]);

  if (!service || !employee) {
    return null;
  }

  const handleConfirmClick = () => {
    if (!selectedSlot) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;

    setDateSlot(selectedDate, selectedSlot);

    createAppointment.mutate(
      {
        employee_id: employee.id,
        service_id: service.id,
        date: selectedDate,
        start_time: selectedSlot.start,
      },
      {
        onSuccess: (data) => {
          setShowConfirm(false);
          navigate(`/booking/queue/${data.appointment.id}`);
        },
        onError: () => {
          setShowConfirm(false);
          setNetworkError(true);
        },
      }
    );
  };

  const morningSlots = data?.slots.filter((s) => Number(s.start.split(':')[0]) < 12) ?? [];
  const afternoonSlots = data?.slots.filter((s) => Number(s.start.split(':')[0]) >= 12) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <StepIndicator current={2} />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">انتخاب زمان نوبت</h1>
        <p className="mt-1 text-sm text-gray-500">لطفاً روز و ساعت مورد نظر خود را برای دریافت خدمات انتخاب کنید.</p>

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <Avatar name={employee.name} imageUrl={employee.avatar_path} />
              <div>
                <p className="font-medium text-gray-800">{service.name}</p>
                <p className="text-xs text-gray-400">
                  {service.duration_minutes} دقیقه · {employee.name}
                </p>
              </div>
            </div>

            <section>
              <h2 className="mb-3 font-bold text-gray-800">انتخاب تاریخ</h2>
              <Calendar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(null); }} />
            </section>

            <section>
              <h2 className="mb-3 font-bold text-gray-800">زمان‌های موجود</h2>

              {isLoading && (
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
                  ))}
                </div>
              )}

              {!isLoading && (data?.slots.length ?? 0) === 0 && <NoSlotsState />}

              {morningSlots.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs text-gray-400">صبح</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {morningSlots.map((s) => (
                      <button
                        key={s.start}
                        onClick={() => setSelectedSlot(s)}
                        className={`rounded-lg border py-2 text-sm font-medium transition ${
                          selectedSlot?.start === s.start
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-gray-100 bg-white text-gray-700 hover:border-primary-200'
                        }`}
                      >
                        {s.start}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {afternoonSlots.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-gray-400">بعد از ظهر</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((s) => (
                      <button
                        key={s.start}
                        onClick={() => setSelectedSlot(s)}
                        className={`rounded-lg border py-2 text-sm font-medium transition ${
                          selectedSlot?.start === s.start
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-gray-100 bg-white text-gray-700 hover:border-primary-200'
                        }`}
                      >
                        {s.start}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          <BookingSummary
            onNext={handleConfirmClick}
            nextLabel={createAppointment.isPending ? 'در حال ثبت...' : 'تایید و نهایی‌سازی رزرو'}
            nextDisabled={!selectedSlot || createAppointment.isPending}
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        title="تأیید رزرو نوبت"
        message={`آیا از رزرو ${service.name} با ${employee.name} در تاریخ ${selectedDate} ساعت ${selectedSlot?.start} اطمینان دارید؟`}
        confirmLabel={createAppointment.isPending ? 'در حال ثبت...' : 'تایید و ثبت نوبت'}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        isLoading={createAppointment.isPending}
      />

      {(isError || networkError) && (
        <NetworkErrorToast onRetry={() => { setNetworkError(false); refetch(); }} />
      )}
    </div>
  );
}
