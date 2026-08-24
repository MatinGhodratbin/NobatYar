import { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';

interface BookingSummaryProps {
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

function toRial(price: number) {
  return price.toLocaleString('fa-IR');
}

export function BookingSummary({ onNext, nextLabel = 'انتخاب زمان و مرحله بعد', nextDisabled }: BookingSummaryProps) {
  const { service, employee } = useBookingStore();
  const [expanded, setExpanded] = useState(false);

  if (!service) return null;

  const content = (
    <>
      <h3 className="font-bold text-gray-900">خلاصه رزرو شما</h3>

      <div className="mt-4 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div>
          <p className="font-medium text-gray-800">{service.name}</p>
          <p className="text-xs text-gray-400">{service.duration_minutes} دقیقه</p>
        </div>
      </div>

      {employee && (
        <div className="flex items-center gap-3 border-b border-gray-100 py-4">
          <p className="text-sm text-gray-600">{employee.name}</p>
        </div>
      )}

      <div className="space-y-2 py-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">هزینه پایه خدمت:</span>
          <span>{toRial(service.price)} تومان</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-100 pt-3 font-bold">
        <span>مبلغ قابل پرداخت</span>
        <span className="text-primary-600">{toRial(service.price)} تومان</span>
      </div>

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="mt-4 w-full rounded-lg bg-primary-600 py-3 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-700 transition"
        >
          {nextLabel}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* دسکتاپ: سایدبار ثابت */}
      <aside className="hidden lg:block w-80 shrink-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm h-fit sticky top-4">
        {content}
      </aside>

      {/* موبایل: bottom sheet جمع‌وجور با امکان باز شدن */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-20 rounded-t-2xl border-t border-gray-100 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="text-sm font-medium">
            {service.name} · {toRial(service.price)} تومان
          </span>
          <span className="text-primary-600 text-sm">{expanded ? 'بستن' : 'جزئیات'}</span>
        </button>

        {expanded && <div className="px-4 pb-2">{content}</div>}

        {onNext && !expanded && (
          <div className="px-4 pb-4">
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className="w-full rounded-lg bg-primary-600 py-3 text-white font-medium disabled:opacity-40"
            >
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    </>
  );
}