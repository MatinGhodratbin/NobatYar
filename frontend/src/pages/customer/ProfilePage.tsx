import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, clearAuth } = useAuthStore();
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-lg px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900">پروفایل من</h1>
        <p className="mt-1 text-sm text-gray-500">مشاهده و ویرایش اطلاعات حساب کاربری</p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">نام</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ایمیل</label>
            <input
              value={currentUser?.email ?? user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">نقش</label>
            <input
              value={
                user?.role === 'customer'
                  ? 'مشتری'
                  : user?.role === 'business_owner'
                  ? 'صاحب کسب‌وکار'
                  : user?.role === 'employee'
                  ? 'کارمند'
                  : user?.role ?? ''
              }
              disabled
              className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setSaved(true)}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              ذخیره
            </button>
            {saved && <span className="text-sm text-green-600 self-center">ذخیره شد</span>}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          خروج از حساب کاربری
        </button>
      </div>
    </div>
  );
}
