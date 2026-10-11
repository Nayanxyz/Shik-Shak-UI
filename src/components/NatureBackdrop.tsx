import { useMemo } from 'react'
import { useThemeStore, type Season } from '../store/themeStore'

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

type TreeKind = 'blossom' | 'full' | 'autumn' | 'bare'

interface Palette {
  sky: string
  hills: { fill: string; opacity: number }[]
  trunk: string
  treeKind: TreeKind
  canopy: { base: string; shade: string; light: string }
  blossom?: string
  groundDecor?: { color: string; type: 'leaf' | 'snow' }[]
  sunColor: string
  sunGlow: string
  particleColor: string
  particleType: 'petal' | 'leaf' | 'snow' | 'sparkle'
  fallClass: string
  windClass: string
  windOpacity: number
}

const palettes: Record<Season, Palette> = {
  spring: {
    sky: 'bg-sky-spring',
    hills: [
      { fill: '#e4d5b7', opacity: 0.9 },
      { fill: '#d4be8e', opacity: 0.9 },
      { fill: '#b89b6a', opacity: 0.9 },
    ],
    trunk: '#8b6f47',
    treeKind: 'blossom',
    canopy: { base: '#a7f3d0', shade: '#6ee7b7', light: '#d1fae5' },
    blossom: '#f9a8d4',
    sunColor: 'bg-rose-200/70',
    sunGlow: 'bg-rose-100/80',
    particleColor: '#fbcfe8',
    particleType: 'petal',
    fallClass: 'animate-fall-slow',
    windClass: 'animate-wind-slow',
    windOpacity: 0.15,
  },
  summer: {
    sky: 'bg-sky-summer',
    hills: [
      { fill: '#c4a97d', opacity: 0.9 },
      { fill: '#a88968', opacity: 0.9 },
      { fill: '#8b6f47', opacity: 0.9 },
    ],
    trunk: '#78553a',
    treeKind: 'full',
    canopy: { base: '#4ade80', shade: '#22c55e', light: '#86efac' },
    sunColor: 'bg-amber-300/80',
    sunGlow: 'bg-amber-200/70',
    particleColor: '#fcd34d',
    particleType: 'sparkle',
    fallClass: 'animate-fall-slow',
    windClass: 'animate-wind-slow',
    windOpacity: 0.1,
  },
  autumn: {
    sky: 'bg-sky-autumn',
    hills: [
      { fill: '#94856d', opacity: 0.9 },
      { fill: '#78716c', opacity: 0.9 },
      { fill: '#57534e', opacity: 0.9 },
    ],
    trunk: '#5c3d24',
    treeKind: 'autumn',
    canopy: { base: '#fb923c', shade: '#ea580c', light: '#fdba74' },
    groundDecor: [
      { color: '#ea580c', type: 'leaf' },
      { color: '#dc2626', type: 'leaf' },
      { color: '#ca8a04', type: 'leaf' },
    ],
    sunColor: 'bg-orange-300/70',
    sunGlow: 'bg-orange-200/60',
    particleColor: '#fb923c',
    particleType: 'leaf',
    fallClass: 'animate-tumble',
    windClass: 'animate-wind',
    windOpacity: 0.2,
  },
  winter: {
    sky: 'bg-sky-winter',
    hills: [
      { fill: '#94a3b8', opacity: 0.9 },
      { fill: '#64748b', opacity: 0.9 },
      { fill: '#475569', opacity: 0.9 },
    ],
    trunk: '#44403c',
    treeKind: 'bare',
    canopy: { base: '#44403c', shade: '#292524', light: '#57534e' },
    groundDecor: [{ color: '#f8fafc', type: 'snow' }],
    sunColor: 'bg-sky-200/80',
    sunGlow: 'bg-sky-100/70',
    particleColor: '#f8fafc',
    particleType: 'snow',
    fallClass: 'animate-fall-med',
    windClass: 'animate-wind-fast',
    windOpacity: 0.25,
  },
}

/* 🌳 Richer flat-vector tree: ground shadow, curved trunk with roots,
   layered canopy (shade + highlight), blossoms / autumn clusters / snow */
function Tree({ palette, scale = 1, flip = false }: { palette: Palette; scale?: number; flip?: boolean }) {
  const { trunk, canopy, treeKind, blossom } = palette
  return (
    <svg
      width={140 * scale}
      height={190 * scale}
      viewBox="0 0 140 190"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, display: 'block' }}
    >
      {/* ground shadow — sells the "planted" look */}
      <ellipse cx="70" cy="184" rx="38" ry="6" fill="#000" opacity="0.08" />

      {/* trunk with slight curve + root flares */}
      <path d="M 65 96 C 65 126 63 156 60 184 L 80 184 C 77 156 75 126 75 96 Z" fill={trunk} />
      <path d="M 60 184 Q 50 178 44 184" stroke={trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 80 184 Q 90 178 96 184" stroke={trunk} strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* branches (autumn + bare) */}
      {(treeKind === 'autumn' || treeKind === 'bare') && (
        <g stroke={trunk} fill="none" strokeLinecap="round">
          <path d="M 70 100 C 70 82 66 70 56 54" strokeWidth="6" />
          <path d="M 70 100 C 70 82 76 68 86 52" strokeWidth="6" />
          <path d="M 56 54 Q 48 44 40 40" strokeWidth="3.5" />
          <path d="M 86 52 Q 94 42 102 38" strokeWidth="3.5" />
          <path d="M 70 96 C 70 76 70 64 70 44" strokeWidth="4.5" />
          <path d="M 70 60 Q 62 50 58 44" strokeWidth="3" />
          <path d="M 70 66 Q 78 56 84 50" strokeWidth="3" />
        </g>
      )}

      {/* canopy */}
      {(treeKind === 'full' || treeKind === 'blossom') && (
        <g>
          <circle cx="44" cy="78" r="26" fill={canopy.base} />
          <circle cx="96" cy="78" r="26" fill={canopy.base} />
          <circle cx="70" cy="60" r="44" fill={canopy.base} />
          <circle cx="62" cy="88" r="26" fill={canopy.shade} opacity="0.5" />
          <circle cx="56" cy="42" r="20" fill={canopy.light} opacity="0.85" />
        </g>
      )}

      {treeKind === 'autumn' && (
        <g>
          <circle cx="70" cy="56" r="30" fill={canopy.base} opacity="0.95" />
          <circle cx="50" cy="70" r="16" fill={canopy.shade} opacity="0.9" />
          <circle cx="90" cy="64" r="14" fill="#facc15" opacity="0.9" />
          <circle cx="80" cy="42" r="12" fill={canopy.light} opacity="0.9" />
          <circle cx="58" cy="46" r="10" fill={canopy.shade} opacity="0.75" />
        </g>
      )}

      {/* blossom dots (spring) */}
      {treeKind === 'blossom' && blossom && (
        <g fill={blossom}>
          <circle cx="52" cy="48" r="3.5" />
          <circle cx="78" cy="40" r="3.5" />
          <circle cx="64" cy="66" r="3.5" />
          <circle cx="90" cy="62" r="3.5" />
          <circle cx="42" cy="70" r="3.5" />
          <circle cx="74" cy="82" r="3.5" />
          <circle cx="98" cy="80" r="3.5" />
        </g>
      )}

      {/* snow on branches + snow mound (winter) */}
      {treeKind === 'bare' && (
        <g>
          <ellipse cx="40" cy="39" rx="7" ry="2.5" fill="#f8fafc" />
          <ellipse cx="102" cy="37" rx="7" ry="2.5" fill="#f8fafc" />
          <ellipse cx="70" cy="43" rx="6" ry="2.5" fill="#f8fafc" />
          <ellipse cx="58" cy="43" rx="5" ry="2" fill="#f1f5f9" />
          <ellipse cx="84" cy="49" rx="5" ry="2" fill="#f1f5f9" />
          <ellipse cx="70" cy="184" rx="30" ry="7" fill="#ffffff" opacity="0.9" />
        </g>
      )}
    </svg>
  )
}

export default function NatureBackdrop() {
  const season = useThemeStore((s) => s.season)
  const palette = palettes[season]

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: seeded(i + 1) * 100,
        size: 6 + seeded(i + 101) * 8,
        delay: seeded(i + 201) * 10,
        duration: 8 + seeded(i + 301) * 8,
      })),
    []
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: seeded(i + 501) * 100,
        top: seeded(i + 601) * 70,
        size: 2 + seeded(i + 701) * 3,
        delay: seeded(i + 801) * 4,
        duration: 2.5 + seeded(i + 901) * 3,
      })),
    []
  )

  const windLines = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        top: 10 + seeded(i + 1001) * 60,
        width: 60 + seeded(i + 1101) * 120,
        delay: seeded(i + 1201) * 6,
        duration: 4 + seeded(i + 1301) * 4,
      })),
    []
  )

  const decorType = palette.groundDecor?.[0]?.type

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${palette.sky}`} />

      <div className={`absolute -top-28 right-[8%] w-80 h-80 rounded-full blur-3xl ${palette.sunGlow}`} />
      <div className={`absolute top-10 right-[14%] w-24 h-24 rounded-full blur-xl ${palette.sunColor}`} />

      {palette.particleType === 'sparkle' &&
        sparkles.map((s, i) => (
          <span
            key={`sp-${i}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: palette.particleColor,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

      {/* 💨 Wind moves ONLY leaves/particles/streaks — never the trees */}
      {windLines.map((w, i) => (
        <div
          key={`w-${i}`}
          className={`absolute h-px ${palette.windClass}`}
          style={{
            top: `${w.top}%`,
            width: `${w.width}px`,
            background: `linear-gradient(90deg, transparent, ${palette.particleColor}, transparent)`,
            opacity: palette.windOpacity,
            animationDelay: `${w.delay}s`,
            animationDuration: `${w.duration}s`,
          }}
        />
      ))}

      {palette.particleType !== 'sparkle' &&
        particles.map((p, i) => (
          <div
            key={`p-${i}`}
            className={`absolute ${palette.fallClass}`}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {palette.particleType === 'snow' ? (
              <div
                className="rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: palette.particleColor,
                  boxShadow: `0 0 ${p.size}px rgba(255,255,255,0.6)`,
                }}
              />
            ) : palette.particleType === 'petal' ? (
              <svg width={p.size} height={p.size} viewBox="0 0 20 20">
                <ellipse cx="10" cy="10" rx="8" ry="4" fill={palette.particleColor} />
              </svg>
            ) : (
              <svg width={p.size * 1.3} height={p.size} viewBox="0 0 26 20">
                <path
                  d="M 2 10 Q 13 2 24 10 Q 13 18 2 10 Z"
                  fill={i % 3 === 0 ? '#ea580c' : i % 3 === 1 ? '#dc2626' : '#ca8a04'}
                />
              </svg>
            )}
          </div>
        ))}

      {/* 🌳 PLANTED trees — no float animation, sitting on the hills */}
      <div className="absolute bottom-24 md:bottom-32 left-[12%] opacity-80">
        <Tree palette={palette} scale={0.55} />
      </div>
      <div className="absolute bottom-16 md:bottom-24 left-[3%]">
        <Tree palette={palette} scale={0.85} />
      </div>
      <div className="absolute bottom-20 md:bottom-28 left-[24%]">
        <Tree palette={palette} scale={1.05} flip />
      </div>
      <div className="absolute bottom-24 md:bottom-32 right-[14%] opacity-80">
        <Tree palette={palette} scale={0.6} flip />
      </div>
      <div className="absolute bottom-16 md:bottom-24 right-[22%]">
        <Tree palette={palette} scale={1} />
      </div>
      <div className="absolute bottom-20 md:bottom-28 right-[3%]">
        <Tree palette={palette} scale={0.9} flip />
      </div>

      {decorType === 'leaf' && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-around px-8">
          {palette.groundDecor!.map((d, i) => (
            <svg key={i} width="18" height="14" viewBox="0 0 26 20" className="rotate-90">
              <path d="M 2 10 Q 13 2 24 10 Q 13 18 2 10 Z" fill={d.color} />
            </svg>
          ))}
        </div>
      )}
      {decorType === 'snow' && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-white/60 blur-sm" />
          <div className="absolute bottom-14 left-[10%] w-32 h-3 bg-white/70 rounded-full blur-sm" />
          <div className="absolute bottom-16 right-[15%] w-40 h-3 bg-white/70 rounded-full blur-sm" />
        </>
      )}

      <svg
        className="absolute bottom-0 left-0 w-full h-40 md:h-56"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={palette.hills[0].fill}
          fillOpacity={palette.hills[0].opacity}
          d="M0,192L80,197.3C160,203,320,213,480,208C640,203,800,181,960,181.3C1120,181,1280,203,1360,213.3L1440,224L1440,320L0,320Z"
        />
        <path
          fill={palette.hills[1].fill}
          fillOpacity={palette.hills[1].opacity}
          d="M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,261.3C1120,267,1280,245,1360,234.7L1440,224L1440,320L0,320Z"
        />
        <path
          fill={palette.hills[2].fill}
          fillOpacity={palette.hills[2].opacity}
          d="M0,288L80,282.7C160,277,320,267,480,272C640,277,800,299,960,304C1120,309,1280,299,1360,293.3L1440,288L1440,320L0,320Z"
        />
      </svg>
    </div>
  )
}