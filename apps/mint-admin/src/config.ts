const API_BASE_URL =
  ((typeof window !== 'undefined' && (window as any)._env_?.VITE_API_BASE_URL) ??
   import.meta.env.VITE_API_BASE_URL ??
   'http://localhost:3000');

const WS_URL =
  ((typeof window !== 'undefined' && (window as any)._env_?.VITE_WS_URL) ??
   import.meta.env.VITE_WS_URL ??
   'http://localhost:3001');

export default {
  API_BASE_URL,
  WS_URL
}