import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (!data?.user) {
            setError('پاسخ نامعتبر از سرور دریافت شد.');
            return;
          }
          navigate(data.user.role === 'customer' ? '/search' : '/admin');
        },
        onError: () => setError('ایمیل یا رمز عبور اشتباه است.'),
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-primary-600 text-center">نوبت‌یار</h1>
        <p className="mt-1 text-center text-sm text-gray-500">ورود به حساب کاربری</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          <div>
            <label className="mb-1 block text-sm text-gray-600">رمز عبور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {login.isPending ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="text-primary-600 font-medium">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}