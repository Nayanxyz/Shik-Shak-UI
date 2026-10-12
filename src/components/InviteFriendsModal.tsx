import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Check, Users } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuthStore } from '../store/authStore'
import { useSeasonTheme } from '../lib/seasonTheme'
import { getFriends, sendRoomInvite, isOnline } from '../lib/supabase'

export default function InviteFriendsModal({ open, onClose, roomCode }: { open: boolean; onClose: () => void; roomCode: string }) {
  const user = useAuthStore((s) => s.user)
  const T = useSeasonTheme()
  const [friends, setFriends] = useState<any[]>([])
  const [sent, setSent] = useState<string[]>([])

  useEffect(() => {
    if (!open || !user) return
    getFriends(user.id).then((r) => setFriends(r.data))
  }, [open, user])

  const invite = async (fid: string) => {
    if (!user) return
    const { error } = await sendRoomInvite(user.id, fid, roomCode)
    if (!error) setSent((s) => [...s, fid])
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Users className={cn('w-5 h-5', T.text)} /> Invite Friends</h3>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500">Online friends get a join banner instantly. Room code: <span className="font-mono font-bold">{roomCode}</span></p>
            {friends.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No friends yet — add some from your Profile page.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {friends.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3 min-w-0">
                      {f.avatar_url
                        ? <img src={f.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        : <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold shrink-0">{(f.username || '?')[0].toUpperCase()}</div>}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{f.username}</div>
                        {isOnline(f.last_seen)
                          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online</span>
                          : <span className="text-[10px] font-bold text-slate-400 uppercase">Offline</span>}
                      </div>
                    </div>
                    <button disabled={sent.includes(f.id)} onClick={() => invite(f.id)}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all', sent.includes(f.id) ? 'bg-green-50 text-green-700 border border-green-200' : T.btn)}>
                      {sent.includes(f.id) ? <><Check className="w-3 h-3" /> Invited</> : <><Send className="w-3 h-3" /> Invite</>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}