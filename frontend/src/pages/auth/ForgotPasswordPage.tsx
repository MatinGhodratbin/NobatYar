import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => setSent(true),
        onError: () => setError('ارسال لینک با خطا مواجه شد. ایمیل را بررسی کنید.'),
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-primary-600 text-center">نوبت‌یار</h1>
        <p className="mt-1 text-center text-sm text-gray-500">بازیابی رمز عبور</p>

        {sent ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              لینک بازیابی رمز عبور به ایمیل شما ارسال شد. ایمیل خود را بررسی کنید.
            </div>
            <Link
              to="/login"
              className="block text-center text-sm font-medium text-primary-600 hover:underline"
            >
              بازگشت به صفحه ورود
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">
              ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برایتان ارسال شود.
            </p>

            <div>
              <label className="mb-1 block text-sm text-gray-600">ایمیل</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={forgotPassword.isPending}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {forgotPassword.isPending ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/login" className="text-primary-600 font-medium">
            بازگشت به صفحه ورود
          </Link>
        </p>
      </div>
    </div>
  );
}
