import { useMemo } from 'react';

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  /** تاریخ‌هایی که تمام بازه‌هایشان پر شده (فرمت YYYY-MM-DD) */
  fullyBookedDates?: string[];
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function Calendar({ selectedDate, onSelectDate, fullyBookedDates = [] }: CalendarProps) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  const todayISO = toISODate(new Date());

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((d) => {
          const iso = toISODate(d);
          const isToday = iso === todayISO;
          const isSelected = iso === selectedDate;
          const isFull = fullyBookedDates.includes(iso);

          let stateClasses = 'border-gray-100 bg-white text-gray-700 hover:border-primary-200';

          if (isSelected) {
            stateClasses = 'bg-primary-600 border-primary-600 text-white';
          } else if (isFull) {
            stateClasses = 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through';
          } else if (isToday) {
            stateClasses = 'border-primary-500 text-primary-600 bg-white ring-1 ring-primary-200';
          }

          return (
            <button
              key={iso}
              disabled={isFull}
              onClick={() => onSelectDate(iso)}
              className={`flex flex-col items-center justify-center rounded-lg border py-2 text-sm font-medium transition ${stateClasses}`}
            >
              {d.getDate()}
              {isToday && !isSelected && <span className="mt-0.5 h-1 w-1 rounded-full bg-primary-500" />}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded border border-primary-500 ring-1 ring-primary-200" /> امروز
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-primary-600" /> روز انتخاب‌شده
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-gray-50 border border-gray-200" /> ظرفیت تکمیل
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-white border border-gray-100" /> قابل انتخاب
        </span>
      </div>
    </div>
  );
}