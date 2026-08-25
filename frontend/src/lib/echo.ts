import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/store/authStore';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

let echoInstance: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> {
  if (echoInstance) return echoInstance;

  const token = useAuthStore.getState().token;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_URL ?? '/api'}/broadcasting/auth`,
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  return echoInstance;
}

export function disconnectEcho(): void {
  echoInstance?.disconnect();
  echoInstance = null;
}