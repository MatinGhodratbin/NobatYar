import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '@/hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    register.mutate(form, {
      onSuccess: () => navigate('/booking'),
      onError: () => setError('ثبت‌نام ناموفق بود. لطفاً اطلاعات را بررسی کنید.'),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-primary-600 text-center">نوبت‌یار</h1>
        <p className="mt-1 text-center text-sm text-gray-500">ساخت حساب کاربری جدید</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {(['name', 'email'] as const).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm text-gray-600">
                {field === 'name' ? 'نام و نام خانوادگی' : 'ایمیل'}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                required
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm text-gray-600">رمز عبور</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">تکرار رمز عبور</label>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {register.isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" className="text-primary-600 font-medium">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}