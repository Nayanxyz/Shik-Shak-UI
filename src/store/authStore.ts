import { create } from 'zustand';
import { supabase, getCurrentUser, getProfile, upsertProfile } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  
  loadUser: async () => {
    const authUser = await getCurrentUser();
    if (!authUser) {
      set({ user: null, loading: false });
      return;
    }

    // Try to get existing profile
    let { data: profile } = await getProfile(authUser.id);

    // If no profile (new user via Google OR email), create one
    if (!profile) {
      const metadata = authUser.user_metadata || {};
      const username = metadata.username || metadata.full_name || metadata.name || authUser.email?.split('@')[0] || 'user';
      
      const { data: created } = await upsertProfile({
        id: authUser.id,
        username: username,
        full_name: metadata.full_name || metadata.name,
        avatar_url: metadata.avatar_url || metadata.picture,
      });
      profile = created;
    }

    set({
      user: {
        id: authUser.id,
        email: authUser.email!,
        username: profile?.username || authUser.email!.split('@')[0],
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
      },
      loading: false,
    });
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },
}));