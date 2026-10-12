import { create } from 'zustand';
import { supabase, getCurrentUser, getProfile, upsertProfile, updateProfile } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  xp?: number;
  level?: number;
  streak?: number;
  badges?: string[];
  equipped_badge?: string | null;
  total_battles?: number;
  total_wins?: number;
  total_practice?: number;
  total_questions?: number;
  correct_count?: number;
  wrong_count?: number;
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

    let { data: profile } = await getProfile(authUser.id);

    if (!profile) {
      const metadata = authUser.user_metadata || {};
      const username = metadata.username || metadata.full_name || metadata.name || authUser.email?.split('@')[0] || 'user';
      const { data: created } = await upsertProfile({
        id: authUser.id,
        username,
        full_name: metadata.full_name || metadata.name,
        avatar_url: metadata.avatar_url || metadata.picture,
      });
      profile = created;
    }

    // 🔥 Daily streak: increment if yesterday active, reset to 1 otherwise
    if (profile) {
      const today = new Date().toISOString().slice(0, 10);
      if (profile.last_active_date !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newStreak = profile.last_active_date === yesterday ? (profile.streak ?? 0) + 1 : 1;
        await updateProfile(authUser.id, { last_active_date: today, streak: newStreak });
        profile = { ...profile, last_active_date: today, streak: newStreak };
      }
    }

    set({
      user: {
        id: authUser.id,
        email: authUser.email!,
        username: profile?.username || authUser.email!.split('@')[0],
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
        xp: profile?.xp ?? 0,
        level: profile?.level ?? 1,
        streak: profile?.streak ?? 0,
        badges: profile?.badges ?? [],
        equipped_badge: profile?.equipped_badge ?? null,
        total_battles: profile?.total_battles ?? 0,
        total_wins: profile?.total_wins ?? 0,
        total_practice: profile?.total_practice ?? 0,
        total_questions: profile?.total_questions ?? 0,
        correct_count: profile?.correct_count ?? 0,
        wrong_count: profile?.wrong_count ?? 0,
      },
      loading: false,
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },
}));