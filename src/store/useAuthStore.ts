import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string, rememberMe: boolean) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: true,
      setAuth: (user, accessToken, refreshToken, rememberMe) => set({ user, accessToken, refreshToken, rememberMe }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, rememberMe: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        refreshToken: state.refreshToken,
        user: state.user,
        rememberMe: state.rememberMe
      }), // Access token is omitted, keeping it in memory only
    }
  )
)

// Clear storage on unload if rememberMe is false
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const state = useAuthStore.getState()
    if (!state.rememberMe) {
      localStorage.removeItem('auth-storage')
    }
  })
}
