import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

interface ThemeState {
  season: Season
  setSeason: (s: Season) => void
  cycleSeason: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      season: 'autumn',
      setSeason: (season) => set({ season }),
      cycleSeason: () => {
        const order: Season[] = ['spring', 'summer', 'autumn', 'winter']
        const cur = get().season
        const next = order[(order.indexOf(cur) + 1) % order.length]
        set({ season: next })
      },
    }),
    { name: 'shik-shak-season' }
  )
)