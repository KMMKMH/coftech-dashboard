'use client';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth';

const socketUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL;
const isBrowser = typeof window !== 'undefined';

let socket: Socket | null = null;

const getAuthToken = () => {
  if (!isBrowser) return null;
  const authState = useAuthStore.getState();
  return authState.token;
};

const initSocket = (token: string) => {
  if (!token) return;
  if (socket) { socket.auth = { token }; socket.connect(); return socket; }

  socket = isBrowser ? io(`${socketUrl}`, {
    autoConnect: true,
    path: "/socket.io",
    transports: ["websocket", "polling"],
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    upgrade: true,
    rememberUpgrade: true,
    auth: {
      token: token
    },
    multiplex: true,
    forceNew: false,
    reconnection: true,
  }) : null;

  if (socket && process.env.NODE_ENV === 'development') {
    socket.onAny((eventName, ...args) => {
      console.log(`[Socket Event] ${eventName}`, args);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] ❌ Connection error:', error.message);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[Socket] 🔄 Attempting reconnection:', attemptNumber);
    });

    socket.on('reconnect_error', (error) => {
      console.error('[Socket] ❌ Reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('[Socket] ❌ Reconnection failed after all attempts');
    });
  }

  return socket;
};

const token = getAuthToken();
if (token) {
  initSocket(token);
}

export const getSocket = () => socket;
export { initSocket };