import { useMemo } from 'react'
import { useThemeStore, type Season } from '../store/themeStore'

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface Palette {
  sky: string
  hills: { fill: string; opacity: number }[]
  sunColor: string
  sunGlow: string
  particleColor: string
  particleType: 'petal' | 'leaf' | 'snow' | 'sparkle'
  fallClass: string
  windClass: string
  windOpacity: number
  groundDecor?: { color: string; type: 'leaf' | 'snow' }[]
}

const palettes: Record<Season, Palette> = {
  spring: {
    sky: 'bg-sky-spring',
    hills: [
      { fill: '#e4d5b7', opacity: 0.9 },
      { fill: '#d4be8e', opacity: 0.9 },
      { fill: '#b89b6a', opacity: 0.9 },
    ],
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
    sunColor: 'bg-orange-300/70',
    sunGlow: 'bg-orange-200/60',
    particleColor: '#fb923c',
    particleType: 'leaf',
    fallClass: 'animate-tumble',
    windClass: 'animate-wind',
    windOpacity: 0.2,
    groundDecor: [
      { color: '#ea580c', type: 'leaf' },
      { color: '#dc2626', type: 'leaf' },
      { color: '#ca8a04', type: 'leaf' },
    ],
  },
  winter: {
    sky: 'bg-sky-winter',
    hills: [
      { fill: '#94a3b8', opacity: 0.9 },
      { fill: '#64748b', opacity: 0.9 },
      { fill: '#475569', opacity: 0.9 },
    ],
    sunColor: 'bg-sky-200/80',
    sunGlow: 'bg-sky-100/70',
    particleColor: '#f8fafc',
    particleType: 'snow',
    fallClass: 'animate-fall-med',
    windClass: 'animate-wind-fast',
    windOpacity: 0.25,
    groundDecor: [{ color: '#f8fafc', type: 'snow' }],
  },
}

const TRUNK: Record<Season, string> = {
  spring: '#96613e',
  summer: '#8a5230',
  autumn: '#7a4423',
  winter: '#6e4a2f',
}

/* Branch tips where spring leaf-clusters / blossoms sit */
const TIPS: [number, number][] = [
  [40, 74], [160, 72], [72, 42], [130, 40], [94, 32], [108, 32],
  [62, 88], [140, 86], [84, 62], [118, 60], [100, 52],
]

/* 🌳 Branch skeleton — always drawn; canopy sits on top of it */
function Skeleton({ color, gauge = 1 }: { color: string; gauge?: number }) {
  return (
    <g stroke={color} fill="none" strokeLinecap="round">
      <path d="M 100 138 C 95 116 80 100 62 88" strokeWidth={7 * gauge} />
      <path d="M 100 138 C 105 114 122 98 140 86" strokeWidth={7 * gauge} />
      <path d="M 100 132 C 98 106 92 86 84 62" strokeWidth={6 * gauge} />
      <path d="M 100 132 C 103 104 110 82 118 60" strokeWidth={6 * gauge} />
      <path d="M 100 130 C 100 102 100 76 100 52" strokeWidth={5 * gauge} />
      <path d="M 62 88 C 55 82 48 78 40 74" strokeWidth={3.5 * gauge} />
      <path d="M 140 86 C 147 80 154 76 160 72" strokeWidth={3.5 * gauge} />
      <path d="M 84 62 C 80 54 76 48 72 42" strokeWidth={3 * gauge} />
      <path d="M 118 60 C 122 52 126 46 130 40" strokeWidth={3 * gauge} />
      <path d="M 100 52 C 98 44 96 38 94 32" strokeWidth={3 * gauge} />
      <path d="M 100 52 C 103 44 106 38 108 32" strokeWidth={3 * gauge} />
    </g>
  )
}

/* 🌳 Flat game-art tree (Image 1 + 4 hybrid): mound → trunk → skeleton → seasonal canopy */
function Tree({ kind, scale = 1, flip = false }: { kind: Season; scale?: number; flip?: boolean }) {
  const trunk = TRUNK[kind]
  const grass = kind === 'spring' ? '#6abe63' : '#2fbf4f'

  return (
    <svg
      width={200 * scale}
      height={250 * scale}
      viewBox="0 0 200 250"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, display: 'block' }}
    >
      {/* ── Ground mound (plants the tree) ── */}
      {kind === 'winter' && (
        <g>
          <ellipse cx="100" cy="238" rx="58" ry="11" fill="#dbeafe" />
          <ellipse cx="100" cy="234" rx="48" ry="10" fill="#f8fafc" />
        </g>
      )}
      {kind === 'autumn' && (
        <g>
          <ellipse cx="100" cy="236" rx="56" ry="11" fill="#d9a866" />
          <ellipse cx="100" cy="233" rx="45" ry="8" fill="#e7c08b" />
          <path d="M 74 228 q 9 -7 18 0 q -9 7 -18 0" fill="#ea580c" />
          <path d="M 96 230 q 9 -7 18 0 q -9 7 -18 0" fill="#ca8a04" />
          <path d="M 116 227 q 8 -6 16 0 q -8 6 -16 0" fill="#dc2626" />
        </g>
      )}
      {(kind === 'spring' || kind === 'summer') && (
        <g>
          <ellipse cx="100" cy="236" rx="56" ry="11" fill={kind === 'spring' ? '#b7e6a5' : '#7bd87b'} />
          <ellipse cx="100" cy="233" rx="45" ry="8" fill={kind === 'spring' ? '#cdefbb' : '#95e295'} />
          <path d="M 68 230 q 3 -10 6 0" stroke={grass} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 92 232 q 3 -10 6 0" stroke={grass} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 118 231 q 3 -10 6 0" stroke={grass} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 136 229 q 3 -10 6 0" stroke={grass} strokeWidth="2" fill="none" strokeLinecap="round" />
          {kind === 'spring' && (
            <g fill="#f9a8d4">
              <circle cx="80" cy="231" r="2.2" />
              <circle cx="112" cy="233" r="2.2" />
              <circle cx="128" cy="230" r="2" />
            </g>
          )}
        </g>
      )}

      {/* ── Trunk with root flares ── */}
      <path d="M 94 234 C 95 198 96 168 97 138 L 103 138 C 104 168 105 198 106 234 Z" fill={trunk} />
      <path d="M 94 234 Q 84 228 76 234" stroke={trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 106 234 Q 116 228 124 234" stroke={trunk} strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* ── Branch skeleton ── */}
      <Skeleton color={trunk} gauge={kind === 'winter' ? 1.25 : 1} />

      {/* ── SUMMER: full layered canopy ── */}
      {kind === 'summer' && (
        <g>
          <ellipse cx="100" cy="80" rx="44" ry="36" fill="#4ade80" />
          <ellipse cx="68" cy="94" rx="26" ry="22" fill="#4ade80" />
          <ellipse cx="132" cy="94" rx="26" ry="22" fill="#4ade80" />
          <ellipse cx="80" cy="58" rx="24" ry="20" fill="#4ade80" />
          <ellipse cx="120" cy="58" rx="24" ry="20" fill="#4ade80" />
          <ellipse cx="90" cy="104" rx="28" ry="14" fill="#16a34a" opacity="0.4" />
          <ellipse cx="128" cy="98" rx="18" ry="10" fill="#16a34a" opacity="0.3" />
          <ellipse cx="82" cy="52" rx="16" ry="12" fill="#86efac" opacity="0.9" />
          <ellipse cx="112" cy="44" rx="11" ry="9" fill="#86efac" opacity="0.7" />
        </g>
      )}

      {/* ── AUTUMN: thinner multicolor canopy + drifting leaves ── */}
      {kind === 'autumn' && (
        <g>
          <ellipse cx="100" cy="82" rx="38" ry="31" fill="#fb923c" />
          <ellipse cx="72" cy="94" rx="22" ry="18" fill="#f59e0b" />
          <ellipse cx="128" cy="94" rx="22" ry="18" fill="#f59e0b" />
          <ellipse cx="84" cy="60" rx="20" ry="17" fill="#fbbf24" />
          <ellipse cx="116" cy="60" rx="20" ry="17" fill="#fb923c" />
          <ellipse cx="92" cy="102" rx="24" ry="12" fill="#c2410c" opacity="0.4" />
          <ellipse cx="84" cy="54" rx="13" ry="10" fill="#fcd34d" opacity="0.85" />
          <path d="M 50 148 q 8 -6 16 0 q -8 6 -16 0" fill="#ea580c" transform="rotate(24 58 148)" />
          <path d="M 146 172 q 8 -6 16 0 q -8 6 -16 0" fill="#ca8a04" transform="rotate(-18 154 172)" />
          <path d="M 158 120 q 7 -5 14 0 q -7 5 -14 0" fill="#dc2626" transform="rotate(40 165 120)" />
        </g>
      )}

      {/* ── SPRING: leaf clusters + blossoms at branch tips (Image 3 sakura style) ── */}
      {kind === 'spring' && (
        <g>
          {TIPS.map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx="11" ry="8" fill="#a7f3d0" />
              <ellipse cx={x - 6} cy={y + 4} rx="7" ry="5" fill="#86efac" />
              <ellipse cx={x + 6} cy={y + 3} rx="7" ry="5" fill="#86efac" />
              {i % 2 === 0 && <circle cx={x + 2} cy={y - 2} r="2.4" fill="#f9a8d4" />}
              {i % 3 === 0 && <circle cx={x - 4} cy={y + 1} r="2" fill="#fbcfe8" />}
            </g>
          ))}
        </g>
      )}

      {/* ── WINTER: snow caps on every branch ── */}
      {kind === 'winter' && (
        <g fill="#f8fafc">
          <ellipse cx="62" cy="86" rx="9" ry="2.6" />
          <ellipse cx="140" cy="84" rx="9" ry="2.6" />
          <ellipse cx="84" cy="60" rx="7" ry="2.2" />
          <ellipse cx="118" cy="58" rx="7" ry="2.2" />
          <ellipse cx="100" cy="50" rx="6" ry="2" />
          <ellipse cx="40" cy="72" rx="6" ry="2" />
          <ellipse cx="160" cy="70" rx="6" ry="2" />
          <ellipse cx="100" cy="136" rx="8" ry="2.4" opacity="0.9" />
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

      {/* 💨 Wind moves leaves/particles only — trees stay planted */}
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

      {/* 🌳 Planted trees — distant pair first (depth), then foreground */}
      <div className="absolute bottom-24 md:bottom-32 left-[13%] opacity-75">
        <Tree kind={season} scale={0.55} />
      </div>
      <div className="absolute bottom-24 md:bottom-32 right-[15%] opacity-75">
        <Tree kind={season} scale={0.6} flip />
      </div>
      <div className="absolute bottom-16 md:bottom-24 left-[2%]">
        <Tree kind={season} scale={0.85} />
      </div>
      <div className="absolute bottom-20 md:bottom-28 left-[24%]">
        <Tree kind={season} scale={1.05} flip />
      </div>
      <div className="absolute bottom-16 md:bottom-24 right-[24%]">
        <Tree kind={season} scale={1} />
      </div>
      <div className="absolute bottom-20 md:bottom-28 right-[2%]">
        <Tree kind={season} scale={0.9} flip />
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