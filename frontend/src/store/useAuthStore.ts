import { create } from 'zustand'
import type { TwitchUser } from '../types/twitchUser'

interface AuthState {
    user: TwitchUser | null;
    isAuthenticated: boolean;
    setUser: (user: TwitchUser | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({
        user: user,
        isAuthenticated: !!user // converts user to boolean: null -> false, object -> true
    }),

    logout: () => set({
        user: null,
        isAuthenticated: false
    }),
}))

export default useAuthStore