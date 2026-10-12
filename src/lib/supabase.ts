import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'loaded (hidden)' : 'MISSING');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUpWithEmail = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
  return { data, error };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const upsertProfile = async (profile: {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();
  return { data, error };
};

export const updateProfile = async (id: string, fields: Record<string, any>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const isUsernameTaken = async (username: string, excludeId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', excludeId)
    .maybeSingle();
  return { taken: !!data, error };
};

export const uploadAvatar = async (userId: string, file: File) => {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true,
    contentType: file.type || `image/${ext}`,
  });
  if (error) return { url: null as string | null, error };
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return { url: data.publicUrl as string | null, error: null as null | Error };
};

// ---------- PRESENCE / FRIENDS / INVITES ----------
export const isOnline = (lastSeen?: string | null, windowMs = 120000) =>
  !!lastSeen && Date.now() - new Date(lastSeen).getTime() < windowMs;

export const heartbeat = async (userId: string) => {
  await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', userId);
};

export const searchUsers = async (query: string, excludeId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, last_seen')
    .ilike('username', `%${query}%`)
    .neq('id', excludeId)
    .limit(8);
  return { data: data || [], error };
};

export const sendFriendRequest = async (fromId: string, toId: string) =>
  supabase.from('friend_requests').insert({ from_id: fromId, to_id: toId });

export const getIncomingRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('friend_requests')
    .select('id, from_id, created_at, from_profiles:profiles!friend_requests_from_id_fkey(id, username, avatar_url)')
    .eq('to_id', userId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const acceptFriendRequest = async (requestId: string, fromId: string, toId: string) => {
  const a = fromId < toId ? fromId : toId;
  const b = fromId < toId ? toId : fromId;
  const { error } = await supabase.from('friends').insert({ user_a: a, user_b: b });
  if (error) return { error };
  return supabase.from('friend_requests').delete().eq('id', requestId);
};

export const declineFriendRequest = async (requestId: string) =>
  supabase.from('friend_requests').delete().eq('id', requestId);

export const getFriends = async (userId: string) => {
  const { data, error } = await supabase
    .from('friends')
    .select('user_a, user_b, a:profiles!friends_user_a_fkey(id, username, avatar_url, last_seen), b:profiles!friends_user_b_fkey(id, username, avatar_url, last_seen)')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);
  if (error) return { data: [] as any[], error };
  return { data: (data || []).map((r: any) => (r.user_a === userId ? r.b : r.a)), error: null };
};

export const sendRoomInvite = async (fromId: string, toId: string, roomCode: string) =>
  supabase.from('room_invites').insert({ from_id: fromId, to_id: toId, room_code: roomCode });

export const getMyInvites = async (userId: string) => {
  const { data, error } = await supabase
    .from('room_invites')
    .select('id, room_code, created_at, from_profiles:profiles!room_invites_from_id_fkey(id, username)')
    .eq('to_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
  return { data: data || [], error };
};

export const deleteInvite = async (id: string) => supabase.from('room_invites').delete().eq('id', id);