import { useState } from 'react';
import { useResendVerification } from '@/hooks/useAuth';

export function EmailVerificationBanner() {
  const resendVerification = useResendVerification();
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-yellow-800">
          ایمیل شما هنوز تایید نشده است. لطفاً ایمیل خود را بررسی کنید.
        </p>
        <button
          onClick={() => {
            resendVerification.mutate(undefined, { onSuccess: () => setSent(true) });
          }}
          disabled={resendVerification.isPending || sent}
          className="shrink-0 rounded-lg border border-yellow-300 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
        >
          {sent ? 'ارسال شد' : 'ارسال مجدد'}
        </button>
      </div>
    </div>
  );
}
