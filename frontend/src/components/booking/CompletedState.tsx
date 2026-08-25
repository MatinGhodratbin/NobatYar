interface CompletedStateProps {
  onBackHome: () => void;
}

export function CompletedState({ onBackHome }: CompletedStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
        ✓
      </div>
      <h2 className="mt-4 text-lg font-bold text-gray-900">نوبت شما تکمیل شد</h2>
      <p className="mt-1 text-sm text-gray-500">امیدواریم از خدمات ما راضی بوده باشید.</p>
      <button
        onClick={onBackHome}
        className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-white text-sm font-medium"
      >
        بازگشت به صفحه اصلی
      </button>
    </div>
  );
}