import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';

interface HeaderProps {
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
}

export function Header({ onSearch, searchPlaceholder = 'جستجو در خدمات یا نوبت‌ها...' }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3">
      <button onClick={() => navigate('/search')} className="text-lg font-bold text-primary-600 shrink-0">
        نوبت‌یار
      </button>

      <form onSubmit={handleSubmit} className="flex-1 max-w-md">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
      </form>

      <div className="flex items-center gap-3">
        <span className="text-gray-400" aria-hidden>
          🔔
        </span>
        {user && <Avatar name={user.name} size="sm" />}
      </div>
    </header>
  );
}