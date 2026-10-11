import { useMemo } from 'react'
import { useThemeStore, type Season } from '../store/themeStore'

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface Palette {
  sky: string
  hills: { fill: string; opacity: number }[]
  trunk: string
  canopy: { fill: string; size: 'full' | 'sparse' | 'none' }[]
  blossoms?: string
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
      { fill: '#e4d5b7', opacity: 0.85 },
      { fill: '#d4be8e', opacity: 0.85 },
      { fill: '#b89b6a', opacity: 0.85 },
    ],
    trunk: '#8b6f47',
    canopy: [{ fill: '#bbf7d0', size: 'full' }],
    blossoms: '#fbcfe8',
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
      { fill: '#c4a97d', opacity: 0.85 },
      { fill: '#a88968', opacity: 0.85 },
      { fill: '#8b6f47', opacity: 0.85 },
    ],
    trunk: '#78553a',
    canopy: [{ fill: '#86efac', size: 'full' }],
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
      { fill: '#94856d', opacity: 0.85 },
      { fill: '#78716c', opacity: 0.85 },
      { fill: '#57534e', opacity: 0.85 },
    ],
    trunk: '#5c3d24',
    canopy: [
      { fill: '#fb923c', size: 'sparse' },
      { fill: '#dc2626', size: 'sparse' },
    ],
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
      { fill: '#94a3b8', opacity: 0.85 },
      { fill: '#64748b', opacity: 0.85 },
      { fill: '#475569', opacity: 0.85 },
    ],
    trunk: '#3f3f46',
    canopy: [{ fill: '#3f3f46', size: 'none' }],
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

function Tree({ palette, scale = 1, flip = false }: { palette: Palette; scale?: number; flip?: boolean }) {
  return (
    <svg
      width={120 * scale}
      height={160 * scale}
      viewBox="0 0 120 160"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M 55 80 L 65 80 L 67 160 L 53 160 Z" fill={palette.trunk} />

      {palette.canopy.map((c, i) => {
        if (c.size === 'full') {
          return (
            <g key={i}>
              <circle cx="60" cy="55" r="42" fill={c.fill} />
              <circle cx="40" cy="70" r="24" fill={c.fill} />
              <circle cx="80" cy="70" r="24" fill={c.fill} />
            </g>
          )
        }
        if (c.size === 'sparse') {
          return (
            <g key={i}>
              <circle cx="60" cy="55" r="28" fill={c.fill} opacity="0.9" />
              <circle cx="42" cy="65" r="14" fill={c.fill} opacity="0.8" />
              <circle cx="78" cy="62" r="12" fill={c.fill} opacity="0.8" />
            </g>
          )
        }
        return null
      })}

      {(palette.canopy[0].size === 'sparse' || palette.canopy[0].size === 'none') && (
        <g stroke={palette.trunk} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 60 80 Q 40 60 20 45" />
          <path d="M 60 80 Q 80 60 100 45" />
          <path d="M 60 80 Q 55 55 45 25" />
          <path d="M 60 80 Q 65 55 75 25" />
          <path d="M 20 45 Q 15 38 8 35" />
          <path d="M 100 45 Q 105 38 112 35" />
        </g>
      )}

      {palette.blossoms && (
        <g fill={palette.blossoms}>
          <circle cx="45" cy="45" r="3" />
          <circle cx="70" cy="38" r="3" />
          <circle cx="55" cy="60" r="3" />
          <circle cx="80" cy="58" r="3" />
          <circle cx="35" cy="62" r="3" />
          <circle cx="65" cy="72" r="3" />
        </g>
      )}

      {palette.canopy[0].size === 'none' && (
        <g fill="#f8fafc">
          <ellipse cx="20" cy="44" rx="6" ry="2" />
          <ellipse cx="100" cy="44" rx="6" ry="2" />
          <ellipse cx="45" cy="24" rx="5" ry="2" />
          <ellipse cx="75" cy="24" rx="5" ry="2" />
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

  // ✅ FIXED: groundDecor is an ARRAY — check its first entry's type
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

      {/* 💨 Wind streaks — present in ALL seasons */}
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

      {/* Falling petals / leaves / snow */}
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

      {/* 🌳 Seasonal trees */}
      <div className="absolute bottom-16 left-[4%] animate-float-slower">
        <Tree palette={palette} scale={0.85} />
      </div>
      <div className="absolute bottom-20 left-[22%] animate-float-soft">
        <Tree palette={palette} scale={1} flip />
      </div>
      <div className="absolute bottom-16 right-[20%] animate-float-slower">
        <Tree palette={palette} scale={1.05} />
      </div>
      <div className="absolute bottom-20 right-[4%] animate-float-soft">
        <Tree palette={palette} scale={0.9} flip />
      </div>

      {/* Ground decor */}
      {decorType === 'leaf' && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-around px-8">
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

      {/* ⛰️ Rolling hills */}
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