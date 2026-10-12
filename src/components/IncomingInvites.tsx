import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuthStore } from '../store/authStore'
import { useSeasonTheme } from '../lib/seasonTheme'
import { getMyInvites, deleteInvite } from '../lib/supabase'

export default function IncomingInvites({ active, onJoin }: { active: boolean; onJoin: (code: string) => void }) {
  const user = useAuthStore((s) => s.user)
  const T = useSeasonTheme()
  const [invites, setInvites] = useState<any[]>([])

  useEffect(() => {
    if (!user || !active) { setInvites([]); return }
    let on = true
    const load = async () => {
      const { data } = await getMyInvites(user.id)
      if (on) setInvites(data)
    }
    load()
    const t = setInterval(load, 10000)
    return () => { on = false; clearInterval(t) }
  }, [user, active])

  if (!active || invites.length === 0) return null

  return (
    <div className="space-y-2 mb-6">
      {invites.map((inv) => (
        <motion.div key={inv.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={cn('p-4 rounded-xl border flex items-center justify-between gap-3 bg-white/85 backdrop-blur-sm shadow-sm', T.border)}>
          <div className="flex items-center gap-2 text-sm text-slate-700 min-w-0">
            <Swords className={cn('w-4 h-4 shrink-0', T.text)} />
            <span className="truncate"><b>{inv.from_profiles?.username || 'A friend'}</b> invited you to room <span className="font-mono font-bold">{inv.room_code}</span></span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => { deleteInvite(inv.id); onJoin(inv.room_code) }} className={cn('px-3 py-1.5 rounded-lg text-xs font-bold', T.btn)}>Join</button>
            <button onClick={() => deleteInvite(inv.id).then(() => setInvites((v) => v.filter((x) => x.id !== inv.id)))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}