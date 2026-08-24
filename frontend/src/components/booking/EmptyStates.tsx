interface NoSlotsStateProps {
  nextAvailableDate?: string | null;
  onJumpToDate?: (date: string) => void;
}

export function NoSlotsState({ nextAvailableDate, onJumpToDate }: NoSlotsStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
      <p className="text-sm font-medium text-gray-700">در این روز هیچ بازه زمانی آزادی وجود ندارد</p>
      {nextAvailableDate && onJumpToDate ? (
        <button
          onClick={() => onJumpToDate(nextAvailableDate)}
          className="mt-3 text-sm text-primary-600 font-medium hover:underline"
        >
          نزدیک‌ترین روز آزاد: {nextAvailableDate} — انتخاب این روز
        </button>
      ) : (
        <p className="mt-2 text-xs text-gray-400">لطفاً روز دیگری را از تقویم انتخاب کنید.</p>
      )}
    </div>
  );
}

export function BusinessClosedState() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
      <p className="text-sm font-medium text-gray-700">این کسب‌وکار در روز/ساعت انتخاب‌شده تعطیل است</p>
      <p className="mt-2 text-xs text-gray-400">لطفاً یکی از روزهای فعال (رنگ سفید) را در تقویم انتخاب کنید.</p>
    </div>
  );
}

interface NetworkErrorToastProps {
  message?: string;
  onRetry: () => void;
}

export function NetworkErrorToast({ message, onRetry }: NetworkErrorToastProps) {
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 shadow-lg">
      <p className="text-sm text-red-700">{message ?? 'خطا در برقراری ارتباط با سرور. اطلاعات فرم شما حفظ شده است.'}</p>
      <button onClick={onRetry} className="mt-2 text-sm font-medium text-red-700 underline">
        تلاش مجدد
      </button>
    </div>
  );
}