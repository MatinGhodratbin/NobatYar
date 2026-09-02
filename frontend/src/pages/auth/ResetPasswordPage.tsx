import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useResetPassword } from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();

  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('رمز عبور و تکرار آن مطابقت ندارند.');
      return;
    }

    resetPassword.mutate(
      { email, password, password_confirmation: passwordConfirmation, token },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => navigate('/login'), 3000);
        },
        onError: () => setError('بازیابی رمز عبور با خطا مواجه شد. لینک ممکن است منقضی شده باشد.'),
      }
    );
  };

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm text-center">
          <p className="text-sm text-red-600">لینک بازیابی نامعتبر است.</p>
          <Link to="/forgot-password" className="mt-4 block text-sm font-medium text-primary-600">
            درخواست لینک جدید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-primary-600 text-center">نوبت‌یار</h1>
        <p className="mt-1 text-center text-sm text-gray-500">تغییر رمز عبور</p>

        {success ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              رمز عبور با موفقیت تغییر کرد. در حال انتقال به صفحه ورود...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">رمز عبور جدید</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">تکرار رمز عبور</label>
              <input
                type="password"
                required
                minLength={8}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={resetPassword.isPending}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {resetPassword.isPending ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
