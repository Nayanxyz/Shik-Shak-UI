import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Camera, Dice5, Check, X, Loader2, Trophy, Target, Flame, Swords,
  Brain, Crown, Shield, LogOut, Save, Sparkles
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuthStore } from '../store/authStore'
import { useSeasonTheme } from '../lib/seasonTheme'
import { useThemeStore } from '../store/themeStore'
import { isUsernameTaken, updateProfile, uploadAvatar } from '../lib/supabase'

interface Stats { battles: number; wins: number; practice: number; questions: number; correct: number; streak: number }

const BADGES: { id: string; name: string; desc: string; icon: any; test: (s: Stats) => boolean }[] = [
  { id: 'first_blood', name: 'First Blood', desc: 'Play your first battle', icon: Swords, test: s => s.battles >= 1 },
  { id: 'veteran', name: 'Veteran', desc: 'Play 10 battles', icon: Shield, test: s => s.battles >= 10 },
  { id: 'champion', name: 'Champion', desc: 'Win a battle room', icon: Crown, test: s => s.wins >= 1 },
  { id: 'jee_warrior', name: 'JEE Warrior', desc: 'Answer 50 questions', icon: Brain, test: s => s.questions >= 50 },
  { id: 'sharpshooter', name: 'Sharpshooter', desc: '80%+ accuracy (20+ questions)', icon: Target, test: s => s.questions >= 20 && s.correct / s.questions >= 0.8 },
  { id: 'on_fire', name: 'On Fire', desc: '3-day login streak', icon: Flame, test: s => s.streak >= 3 },
]

function hashStr(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) }

function GeneratedAvatar({ seed, size = 96 }: { seed: string; size?: number }) {
  const h = hashStr(seed || 'shik')
  const hue1 = h % 360
  const hue2 = (hue1 + 60 + (h >> 3) % 60) % 360
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="rounded-full block">
      <defs>
        <linearGradient id={`g${h}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue1} 70% 62%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2} 70% 45%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#g${h})`} />
      <circle cx={30 + (h >> 2) % 40} cy={30 + (h >> 4) % 40} r={16 + (h >> 5) % 12} fill="white" opacity="0.85" />
      <rect x={55 - (h >> 7) % 25} y={55} width="26" height="26" rx="7" fill="white" opacity="0.5" transform={`rotate(${(h >> 6) % 90} 50 50)`} />
      <path d={`M ${18 + (h >> 8) % 20} 86 L 50 ${32 + (h >> 9) % 20} L 82 86 Z`} fill="white" opacity="0.35" />
    </svg>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const loadUser = useAuthStore(s => s.loadUser)
  const signOut = useAuthStore(s => s.signOut)
  const T = useSeasonTheme()
  const season = useThemeStore(s => s.season)

  const [username, setUsername] = useState(user?.username || '')
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [useGenerated, setUseGenerated] = useState(!user?.avatar_url)
  const [usernameState, setUsernameState] = useState<'idle' | 'checking' | 'taken' | 'free'>('idle')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const stats: Stats = useMemo(() => ({
    battles: user?.total_battles ?? 0,
    wins: user?.total_wins ?? 0,
    practice: user?.total_practice ?? 0,
    questions: user?.total_questions ?? 0,
    correct: user?.correct_count ?? 0,
    streak: user?.streak ?? 0,
  }), [user])

  const unlocked = useMemo(() => BADGES.filter(b => b.test(stats)).map(b => b.id), [stats])
  const storedBadges = user?.badges ?? []

  // auto-save newly unlocked badges
  useEffect(() => {
    const missing = unlocked.filter(id => !storedBadges.includes(id))
    if (!user || missing.length === 0) return
    updateProfile(user.id, { badges: [...storedBadges, ...missing] }).then(() => loadUser())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked.join(',')])

  // debounced username availability check
  useEffect(() => {
    const name = username.trim()
    if (!user || name === user.username || name.length < 3) { setUsernameState('idle'); return }
    setUsernameState('checking')
    const t = setTimeout(async () => {
      const { taken } = await isUsernameTaken(name, user.id)
      setUsernameState(taken ? 'taken' : 'free')
    }, 400)
    return () => clearTimeout(t)
  }, [username, user])

  const xp = user?.xp ?? 0
  const level = Math.floor(xp / 100) + 1
  const levelProgress = xp % 100
  const accuracy = stats.questions > 0 ? Math.round((stats.correct / stats.questions) * 100) : 0
  const winRate = stats.battles > 0 ? Math.round((stats.wins / stats.battles) * 100) : 0
  const equipped = BADGES.find(b => b.id === user?.equipped_badge)

  const onFile = async (f: File | null) => {
    if (!f || !user) return
    if (f.size > 2 * 1024 * 1024) { setMsg({ kind: 'err', text: 'Image must be under 2MB' }); return }
    setUploading(true)
    const { url, error } = await uploadAvatar(user.id, f)
    setUploading(false)
    if (error || !url) { setMsg({ kind: 'err', text: (error as any)?.message || 'Upload failed' }); return }
    setAvatarUrl(url); setUseGenerated(false)
    setMsg({ kind: 'ok', text: 'Photo ready — press Save Changes to apply' })
  }

  const equipBadge = async (id: string | null) => {
    if (!user) return
    const { error } = await updateProfile(user.id, { equipped_badge: id })
    if (!error) await loadUser()
  }

  const saveChanges = async () => {
    if (!user) return
    setSaving(true); setMsg(null)
    try {
      const { error } = await updateProfile(user.id, {
        username: username.trim(),
        full_name: fullName.trim() || null,
        avatar_url: useGenerated ? null : (avatarUrl || null),
      })
      if (error) throw error
      await loadUser()
      setMsg({ kind: 'ok', text: 'Profile saved!' })
    } catch (e: any) {
      setMsg({ kind: 'err', text: e.message || 'Failed to save profile' })
    } finally { setSaving(false) }
  }

  const glass = "rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm"

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      {msg && (
        <div className={cn("p-3 rounded-xl border text-sm flex items-center gap-2", msg.kind === 'ok' ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700")}>
          {msg.kind === 'ok' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} {msg.text}
        </div>
      )}

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={cn(glass, "p-6 flex items-center gap-5")}>
        <div className="relative shrink-0">
          <div className={cn("w-24 h-24 rounded-full overflow-hidden border-4 shadow-md bg-white", T.border)}>
            {useGenerated || !avatarUrl
              ? <GeneratedAvatar seed={user?.username || 'shik'} size={96} />
              : <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />}
          </div>
          <div className={cn("absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow", T.solid)}>Lv {level}</div>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black text-slate-900 truncate">{user?.username}</h1>
          <p className="text-slate-500 text-sm truncate">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {equipped && (
              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border", T.btnSoft)}>
                <equipped.icon className="w-3 h-3" /> {equipped.name}
              </span>
            )}
            {stats.streak > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                <Flame className="w-3 h-3" /> {stats.streak}-day streak
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>XP {xp}</span><span>{100 - levelProgress} XP to Lv {level + 1}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <motion.div className={cn("h-full bg-gradient-to-r", T.bar)} initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Identity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={cn(glass, "p-6 space-y-4")}>
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><User className={cn("w-4 h-4", T.text)} /> Identity</h2>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Username</label>
            <div className="relative">
              <input value={username} onChange={e => setUsername(e.target.value)} maxLength={20}
                className={cn("w-full p-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-slate-900 transition-all", T.ring)} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameState === 'checking' && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                {usernameState === 'free' && <Check className="w-4 h-4 text-green-600" />}
                {usernameState === 'taken' && <X className="w-4 h-4 text-red-500" />}
              </div>
            </div>
            {usernameState === 'taken' && <p className="text-xs text-red-600 mt-1">Username already taken</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Full Name (optional)</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name"
              className={cn("w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-slate-900 transition-all", T.ring)} />
          </div>
          <button onClick={saveChanges} disabled={saving || usernameState === 'taken' || !username.trim()}
            className={cn("w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all", (saving || usernameState === 'taken' || !username.trim()) ? "bg-slate-200 text-slate-400 cursor-not-allowed" : cn(T.btn, "hover:scale-[1.01]"))}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
          </button>
        </motion.div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cn(glass, "p-6 space-y-4")}>
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Camera className={cn("w-4 h-4", T.text)} /> Avatar</h2>
          <div className="flex items-center gap-4">
            <div className={cn("w-20 h-20 rounded-full overflow-hidden border-2 shrink-0", T.border)}>
              {useGenerated || !avatarUrl ? <GeneratedAvatar seed={username || 'shik'} size={80} /> : <img src={avatarUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="space-y-2 flex-1">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0] || null)} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className={cn("w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all", T.btn)}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />} Upload Photo
              </button>
              <button onClick={() => { setUseGenerated(true); setAvatarUrl('') }}
                className={cn("w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all", T.btnSoft)}>
                <Dice5 className="w-4 h-4" /> Use Generated Avatar
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Generated avatars are unique to your username — no upload needed. Photos must be under 2MB.</p>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={cn(glass, "p-6")}>
        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Trophy className={cn("w-4 h-4", T.text)} /> Career Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Battles', value: stats.battles },
            { label: 'Wins', value: stats.wins },
            { label: 'Win Rate', value: `${winRate}%` },
            { label: 'Practice Sessions', value: stats.practice },
            { label: 'Questions', value: stats.questions },
            { label: 'Accuracy', value: `${accuracy}%` },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl bg-white/80 border border-slate-200 text-center">
              <div className={cn("text-2xl font-black", T.text)}>{s.value}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn(glass, "p-6")}>
        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className={cn("w-4 h-4", T.text)} /> Badges</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map(b => {
            const isUnlocked = unlocked.includes(b.id) || storedBadges.includes(b.id)
            const isEquipped = user?.equipped_badge === b.id
            return (
              <div key={b.id} className={cn(
                "p-4 rounded-2xl border text-center transition-all",
                isUnlocked ? "bg-white/90 border-slate-200 shadow-sm" : "bg-slate-100/60 border-slate-200 opacity-50 grayscale"
              )}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2", isUnlocked ? T.iconBg : "bg-slate-200 text-slate-400")}>
                  <b.icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900">{b.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{b.desc}</div>
                {isUnlocked && (
                  <button onClick={() => equipBadge(isEquipped ? null : b.id)}
                    className={cn("mt-2 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all", isEquipped ? T.solid : T.btnSoft)}>
                    {isEquipped ? 'Equipped' : 'Equip'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={cn(glass, "p-6 space-y-3")}>
        <h2 className="font-bold text-slate-900">Settings</h2>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-200">
          <span className="text-sm text-slate-600">Current season theme</span>
          <span className={cn("text-sm font-bold capitalize", T.text)}>{season} 🌿</span>
        </div>
        <p className="text-xs text-slate-500">Change seasons anytime with the floating button in the bottom-right corner.</p>
        <button onClick={async () => { await signOut(); navigate('/login') }}
          className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold flex items-center justify-center gap-2 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </motion.div>
    </div>
  )
}