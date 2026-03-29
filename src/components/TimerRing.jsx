import { useEffect, useMemo, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const parseHsl = (hslColor) => {
  const match = hslColor.match(/hsl\(([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/i)

  if (!match) {
    return { h: 0, s: 80, l: 50 }
  }

  return {
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
  }
}

const mixHsl = (from, to, amount) => ({
  h: from.h + (to.h - from.h) * amount,
  s: from.s + (to.s - from.s) * amount,
  l: from.l + (to.l - from.l) * amount,
})

const toHslString = ({ h, s, l }) =>
  `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`

const getUrgencyColor = (baseColor, progress) => {
  const base = parseHsl(baseColor)
  const amber = { h: 38, s: 94, l: 56 }
  const red = { h: 2, s: 90, l: 58 }

  if (progress > 0.5) {
    return toHslString(base)
  }

  if (progress > 0.25) {
    const amount = 1 - (progress - 0.25) / 0.25
    return toHslString(mixHsl(base, amber, amount))
  }

  const amount = 1 - progress / 0.25
  return toHslString(mixHsl(amber, red, amount))
}

function TimerRing({
  duration,
  onComplete,
  color,
  label,
  resetKey,
  className = '',
}) {
  const totalMs = duration * 1000
  const [remainingMs, setRemainingMs] = useState(totalMs)
  const completeCalled = useRef(false)

  useEffect(() => {
    setRemainingMs(totalMs)
    completeCalled.current = false
  }, [resetKey, totalMs])

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs((current) => {
        const next = clamp(current - 100, 0, totalMs)

        if (next === 0 && !completeCalled.current) {
          completeCalled.current = true
          onComplete?.()
        }

        return next
      })
    }, 100)

    return () => clearInterval(timer)
  }, [onComplete, totalMs])

  const progress = remainingMs / totalMs
  const radius = 44
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const dashoffset = circumference * (1 - progress)

  const ringColor = useMemo(
    () => getUrgencyColor(color, progress),
    [color, progress],
  )

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative grid h-28 w-28 place-items-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={normalizedRadius}
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-200 dark:text-slate-700"
            fill="transparent"
          />
          <circle
            cx="44"
            cy="44"
            r={normalizedRadius}
            stroke={ringColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 100ms linear, stroke 280ms ease' }}
          />
        </svg>
        <span className="absolute text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {Math.ceil(remainingMs / 1000)}
        </span>
      </div>
      <p className="text-xs font-semibold tracking-[0.28em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  )
}

export default TimerRing
