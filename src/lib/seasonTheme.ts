import { useThemeStore, type Season } from '../store/themeStore'

export interface SeasonTheme {
  btn: string        // solid CTA buttons
  btnSoft: string    // tinted secondary buttons
  solid: string      // small solid badges (option letters, avatars)
  text: string       // accent text
  textSoft: string   // softer accent text
  gradient: string   // hero/score gradient text
  border: string     // accent borders
  softBg: string     // tinted backgrounds (banners, chips)
  ring: string       // input focus rings
  chipActive: string // active selector cards
  bar: string        // progress bar gradient
  iconBg: string     // icon tiles
}

export const seasonThemes: Record<Season, SeasonTheme> = {
  spring: {
    btn: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25',
    btnSoft: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
    solid: 'bg-rose-500 text-white',
    text: 'text-rose-600',
    textSoft: 'text-rose-500',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    border: 'border-rose-300',
    softBg: 'bg-rose-50',
    ring: 'focus:border-rose-400 focus:ring-2 focus:ring-rose-500/25',
    chipActive: 'border-rose-400 bg-rose-50 text-rose-700 shadow-sm',
    bar: 'from-rose-400 to-pink-400',
    iconBg: 'bg-rose-100 text-rose-600',
  },
  summer: {
    btn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25',
    btnSoft: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100',
    solid: 'bg-amber-500 text-white',
    text: 'text-amber-600',
    textSoft: 'text-amber-600',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    border: 'border-amber-300',
    softBg: 'bg-amber-50',
    ring: 'focus:border-amber-400 focus:ring-2 focus:ring-amber-500/25',
    chipActive: 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm',
    bar: 'from-amber-400 to-orange-400',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  autumn: {
    btn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/25',
    btnSoft: 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100',
    solid: 'bg-orange-600 text-white',
    text: 'text-orange-700',
    textSoft: 'text-orange-600',
    gradient: 'from-orange-600 via-red-500 to-amber-500',
    border: 'border-orange-300',
    softBg: 'bg-orange-50',
    ring: 'focus:border-orange-400 focus:ring-2 focus:ring-orange-500/25',
    chipActive: 'border-orange-400 bg-orange-50 text-orange-700 shadow-sm',
    bar: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-100 text-orange-700',
  },
  winter: {
    btn: 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25',
    btnSoft: 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100',
    solid: 'bg-sky-600 text-white',
    text: 'text-sky-700',
    textSoft: 'text-sky-600',
    gradient: 'from-sky-600 via-blue-500 to-indigo-500',
    border: 'border-sky-300',
    softBg: 'bg-sky-50',
    ring: 'focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25',
    chipActive: 'border-sky-400 bg-sky-50 text-sky-700 shadow-sm',
    bar: 'from-sky-400 to-blue-400',
    iconBg: 'bg-sky-100 text-sky-700',
  },
}

export function useSeasonTheme(): SeasonTheme {
  const season = useThemeStore((s) => s.season)
  return seasonThemes[season]
}