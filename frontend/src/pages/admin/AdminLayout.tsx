import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { disconnectEcho } from '@/lib/echo';
import { Avatar } from '@/components/ui/Avatar';
import { useUpdateMyStatus } from '@/hooks/useEmployeeStatus';
import { useMyBusiness } from '@/hooks/useMyBusiness';
import { useCreateBusiness } from '@/hooks/useBusinessOnboarding';

const allNavItems = [
  { to: '/admin', label: 'داشبورد', end: true, ownerOnly: false },
  { to: '/admin/appointments', label: 'نوبت‌ها', ownerOnly: false },
  { to: '/admin/services', label: 'سرویس‌ها', ownerOnly: true },
  { to: '/admin/employees', label: 'کارمندان', ownerOnly: true },
  { to: '/admin/working-hours', label: 'ساعات کاری', ownerOnly: true },
  { to: '/admin/settings', label: 'تنظیمات', ownerOnly: true },
];

function OnboardingForm() {
  const createBusiness = useCreateBusiness();
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createBusiness.mutate(form, {
      onError: (err: any) => {
        setError(err?.response?.data?.message ?? 'ثبت کسب‌وکار با خطا مواجه شد.');
      },
    });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 text-center">ساخت کسب‌وکار</h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          برای استفاده از پنل مدیریت، ابتدا کسب‌وکار خود را بسازید.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">نام کسب‌وکار *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="مثلاً پیرایش مدرن"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">توضیحات</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              rows={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">آدرس</label>
            <input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">تلفن</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={createBusiness.isPending}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {createBusiness.isPending ? 'در حال ثبت...' : 'ساخت کسب‌وکار'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const updateMyStatus = useUpdateMyStatus();
  const { data: business, isLoading: businessLoading } = useMyBusiness();

  const handleLogout = () => {
    disconnectEcho();
    clearAuth();
    navigate('/login');
  };

  const isOwner = user?.role === 'business_owner';
  const navItems = allNavItems.filter((item) => !item.ownerOnly || isOwner);

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4 flex items-center gap-2 px-2">
        <span className="text-lg font-bold text-primary-600">نوبت‌یار</span>
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="mt-6 rounded-lg px-3 py-2 text-right text-sm font-medium text-red-600 hover:bg-red-50"
      >
        خروج
      </button>
    </nav>
  );

  if (businessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!business && isOwner) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <aside className="hidden lg:block w-64 shrink-0 border-l border-gray-100 bg-white">
          {sidebarContent}
        </aside>
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
              {sidebarContent}
            </div>
          </div>
        )}
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:px-6">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-gray-600" aria-label="منو">☰</button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
              {user && <Avatar name={user.name} size="sm" />}
            </div>
          </header>
          <main className="p-4 lg:p-6">
            <OnboardingForm />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:block w-64 shrink-0 border-l border-gray-100 bg-white">
        {sidebarContent}
      </aside>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:px-6">
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-gray-600" aria-label="منو">
            ☰
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {user?.role === 'employee' && (
              <select
                defaultValue="working"
                onChange={(e) => updateMyStatus.mutate(e.target.value as 'working' | 'resting' | 'off')}
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
              >
                <option value="working">در حال کار</option>
                <option value="resting">استراحت</option>
                <option value="off">غیرفعال</option>
              </select>
            )}
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            {user && <Avatar name={user.name} size="sm" />}
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
