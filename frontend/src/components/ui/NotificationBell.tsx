import { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';

export function NotificationBell() {
  const { notifications, markRead, markAllRead, unreadCount } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = unreadCount();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition"
        aria-label="نوتیفیکیشن‌ها"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <span className="text-xs font-bold text-gray-700">نوتیفیکیشن‌ها</span>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">
                همه خوانده شد
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-gray-400">نوتیفیکیشنی وجود ندارد</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false); }}
                  className={`w-full px-3 py-2 text-right transition hover:bg-gray-50 ${
                    !n.read ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <p className="text-xs font-medium text-gray-800">{n.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.message}</p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    {n.createdAt.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
