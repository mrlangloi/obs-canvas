import { create } from 'zustand'
import type { TwitchUser } from '../types/twitchUser'

interface AuthState {
    isLoggedIn: boolean;
    user: TwitchUser | null;
    setUser: (user: TwitchUser | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    user: {
            id: '',
            display_name: '',
            profile_image_url: '',
            isAuthorized: false,
            moderatedChannels: []
        },

    setUser: (user) => set({
        isLoggedIn: user?.id ? true : false,
        user: {
            id: user?.id || '',
            display_name: user?.display_name || '',
            profile_image_url: user?.profile_image_url || '',
            isAuthorized: user?.isAuthorized || false,
            moderatedChannels: user?.moderatedChannels || []
        }
    }),

    logout: () => set({
        isLoggedIn: false,
        user: {
            id: '',
            display_name: '',
            profile_image_url: '',
            isAuthorized: false,
            moderatedChannels: []
        }
    }),
}))

export default useAuthStore