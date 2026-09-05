import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  add: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  add: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date(),
        },
        ...state.notifications,
      ].slice(0, 50),
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clear: () => set({ notifications: [] }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
