import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Check, X, Loader2, Search, Users } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuthStore } from '../store/authStore'
import { useSeasonTheme } from '../lib/seasonTheme'
import {
  searchUsers, sendFriendRequest, getIncomingRequests, acceptFriendRequest,
  declineFriendRequest, getFriends, isOnline,
} from '../lib/supabase'

function OnlineDot({ online }: { online: boolean }) {
  return online ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
      <span className="w-2 h-2 rounded-full bg-slate-300" /> Offline
    </span>
  )
}

function Face({ f, size = 'w-9 h-9' }: { f: any; size?: string }) {
  return f?.avatar_url
    ? <img src={f.avatar_url} alt="" className={cn(size, 'rounded-full object-cover shrink-0')} />
    : <div className={cn(size, 'rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold shrink-0')}>{(f?.username || '?')[0].toUpperCase()}</div>
}

export default function FriendsPanel() {
  const user = useAuthStore((s) => s.user)
  const T = useSeasonTheme()
  const [friends, setFriends] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) return
    const [f, r] = await Promise.all([getFriends(user.id), getIncomingRequests(user.id)])
    setFriends(f.data)
    setRequests(r.data)
  }, [user])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 30000)
    return () => clearInterval(t)
  }, [refresh])

  useEffect(() => {
    if (!user || query.trim().length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      const { data } = await searchUsers(query.trim(), user.id)
      setResults(data)
    }, 350)
    return () => clearTimeout(t)
  }, [query, user])

  const glass = 'rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className={cn(glass, 'p-6 space-y-5')}>
      <h2 className="font-bold text-slate-900 flex items-center gap-2"><Users className={cn('w-4 h-4', T.text)} /> Friends</h2>

      {/* Add friend */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Add Friend by Username</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search username…"
            className={cn('w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-slate-900 text-sm transition-all', T.ring)} />
        </div>
        {results.length > 0 && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Face f={r} size="w-7 h-7" />
                  <span className="text-sm text-slate-700 truncate">{r.username}</span>
                  <OnlineDot online={isOnline(r.last_seen)} />
                </div>
                <button
                  disabled={busy === r.id}
                  onClick={async () => {
                    if (!user) return
                    setBusy(r.id)
                    await sendFriendRequest(user.id, r.id)
                    setBusy(null)
                    setQuery('')
                    setResults([])
                  }}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all', T.btnSoft)}>
                  {busy === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />} Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incoming requests */}
      {requests.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Friend Requests</h3>
          <div className="space-y-2">
            {requests.map((rq) => (
              <div key={rq.id} className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <Face f={rq.from_profiles} />
                  <span className="text-sm font-medium text-slate-800 truncate">{rq.from_profiles?.username}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={async () => { setBusy(rq.id); await acceptFriendRequest(rq.id, rq.from_id, user!.id); setBusy(null); refresh() }}
                    className="p-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all"><Check className="w-4 h-4" /></button>
                  <button onClick={async () => { setBusy(rq.id); await declineFriendRequest(rq.id); setBusy(null); refresh() }}
                    className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <p className="text-sm text-slate-500">No friends yet — search a username above to send a request.</p>
        ) : (
          <div className="space-y-2">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <Face f={f} />
                  <span className="text-sm font-medium text-slate-800 truncate">{f.username}</span>
                </div>
                <OnlineDot online={isOnline(f.last_seen)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}