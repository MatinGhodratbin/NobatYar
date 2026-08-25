import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { to: '/admin', label: 'داشبورد', end: true },
  { to: '/admin/appointments', label: 'نوبت‌ها' },
  { to: '/admin/settings', label: 'تنظیمات' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* دسکتاپ: سایدبار ثابت */}
      <aside className="hidden lg:block w-64 shrink-0 border-l border-gray-100 bg-white">
        {sidebarContent}
      </aside>

      {/* موبایل: hamburger + drawer */}
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

          <div className="flex items-center gap-2">
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