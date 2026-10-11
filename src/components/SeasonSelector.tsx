import { useThemeStore, type Season } from '../store/themeStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Flower2, Sun, Leaf, Snowflake } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const seasons: { id: Season; label: string; icon: any; color: string }[] = [
  { id: 'spring', label: 'Spring', icon: Flower2, color: 'text-pink-500' },
  { id: 'summer', label: 'Summer', icon: Sun, color: 'text-amber-500' },
  { id: 'autumn', label: 'Autumn', icon: Leaf, color: 'text-orange-500' },
  { id: 'winter', label: 'Winter', icon: Snowflake, color: 'text-sky-400' },
]

export default function SeasonSelector() {
  const { season, setSeason } = useThemeStore()
  const [open, setOpen] = useState(false)
  const current = seasons.find((s) => s.id === season)!

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 flex flex-col gap-2"
          >
            {seasons.map((s) => {
              const Icon = s.icon
              const active = season === s.id
              return (
                <motion.button
                  key={s.id}
                  onClick={() => {
                    setSeason(s.id)
                    setOpen(false)
                  }}
                  whileHover={{ x: -4, scale: 1.05 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-md border shadow-lg transition-colors",
                    active
                      ? "bg-white border-slate-300 text-slate-900"
                      : "bg-white/70 border-slate-200 text-slate-600 hover:bg-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4", s.color)} />
                  <span className="text-sm font-semibold">{s.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-1" />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08, rotate: 12 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center",
          "backdrop-blur-md border shadow-xl",
          "bg-white/80 border-slate-200 text-slate-700"
        )}
        title={`Switch season (current: ${season})`}
      >
        <current.icon className={cn("w-6 h-6", current.color)} />
      </motion.button>
    </div>
  )
}