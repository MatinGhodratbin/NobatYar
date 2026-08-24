import { useNavigate } from 'react-router-dom';
import { useServices, useEmployees } from '@/hooks/useBookingData';
import { useBookingStore } from '@/store/bookingStore';
import { StepIndicator } from '@/components/booking/StepIndicator';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { Avatar } from '@/components/ui/Avatar';
import type { Service, Employee } from '@/types';

function toRial(price: number) {
  return price.toLocaleString('fa-IR');
}

export default function ServiceSelectionPage() {
  const navigate = useNavigate();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { service, employee, setService, setEmployee } = useBookingStore();
  const { data: employees, isLoading: employeesLoading } = useEmployees(service?.id);

  const handleSelectService = (s: Service) => {
    setService(s);
  };

  const handleSelectEmployee = (e: Employee) => {
    setEmployee(e);
  };

  const canProceed = !!service && !!employee;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <StepIndicator current={1} />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ثبت نوبت جدید</h1>
        <p className="mt-1 text-sm text-gray-500">خدمت مورد نظر و آرایشگر خود را برای رزرو انتخاب کنید</p>

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-8">
            {/* خدمات — گرید ریسپانسیو: موبایل تک‌ستونه، دسکتاپ ۲ ستونه */}
            <section>
              <h2 className="mb-3 font-bold text-gray-800">خدمات محبوب</h2>

              {servicesLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              )}

              {!servicesLoading && services?.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                  در حال حاضر خدمتی برای این کسب‌وکار ثبت نشده است.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectService(s)}
                    className={`text-right rounded-xl border p-4 transition ${
                      service?.id === s.id
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/40'
                        : 'border-gray-100 bg-white hover:border-primary-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{s.duration_minutes} دقیقه</span>
                      {service?.id === s.id && (
                        <span className="rounded-full bg-primary-600 text-white text-xs px-2 py-0.5">
                          انتخاب شده
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-gray-800">{s.name}</p>
                    <p className="mt-1 text-sm text-primary-600 font-semibold">{toRial(s.price)} تومان</p>
                  </button>
                ))}
              </div>
            </section>

            {/* متخصصان — موبایل: اسکرول افقی، دسکتاپ: گرید */}
            {service && (
              <section>
                <h2 className="mb-3 font-bold text-gray-800">انتخاب آرایشگر/متخصص</h2>

                {employeesLoading && (
                  <div className="flex gap-3 overflow-x-auto sm:grid sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 w-40 shrink-0 animate-pulse rounded-xl bg-gray-100 sm:w-auto" />
                    ))}
                  </div>
                )}

                {!employeesLoading && employees?.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                    برای این خدمت هنوز متخصصی تعریف نشده است.
                  </div>
                )}

                <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
                  {employees?.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => handleSelectEmployee(e)}
                      className={`w-40 shrink-0 sm:w-auto rounded-xl border p-4 text-center transition ${
                        employee?.id === e.id
                          ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/40'
                          : 'border-gray-100 bg-white hover:border-primary-200'
                      }`}
                    >
                      <div className="flex justify-center">
                        <Avatar name={e.name} imageUrl={e.avatar_path} size="lg" />
                      </div>
                      <p className="mt-2 font-medium text-gray-800 text-sm">{e.name}</p>
                      {e.position && <p className="text-xs text-gray-400">{e.position}</p>}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <BookingSummary
            onNext={() => navigate('/booking/datetime')}
            nextDisabled={!canProceed}
          />
        </div>
      </div>
    </div>
  );
}