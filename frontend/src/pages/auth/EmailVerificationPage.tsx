import { useState } from 'react';
import { useResendVerification } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export default function EmailVerificationPage() {
  const { user } = useAuthStore();
  const resendVerification = useResendVerification();
  const [sent, setSent] = useState(false);

  const handleResend = () => {
    resendVerification.mutate(undefined, {
      onSuccess: () => setSent(true),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <span className="text-2xl">📧</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">تایید ایمیل</h1>
        <p className="mt-2 text-sm text-gray-500">
          یک ایمیل تایید به <span className="font-medium">{user?.email}</span> ارسال شد.
          <br />
          لطفاً روی لینک تایید در ایمیل کلیک کنید.
        </p>

        {sent && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            ایمیل تایید مجدداً ارسال شد.
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={resendVerification.isPending}
          className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {resendVerification.isPending ? 'در حال ارسال...' : 'ارسال مجدد ایمیل تایید'}
        </button>
      </div>
    </div>
  );
}
