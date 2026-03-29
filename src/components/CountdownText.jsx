import { useEffect, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const formatTimer = (remainingMs) => {
  const total = Math.max(0, remainingMs)
  const seconds = Math.floor(total / 1000)
  const fraction = total % 1000
  const first = Math.floor(fraction / 10)
  const second = Math.floor((fraction % 10) * 10)

  return `${seconds}.${String(first).padStart(2, '0')}.${String(second).padStart(2, '0')} sec`
}

function CountdownText({ durationMs, onComplete, resetKey, className = '' }) {
  const [remainingMs, setRemainingMs] = useState(durationMs)
  const completeCalled = useRef(false)

  useEffect(() => {
    setRemainingMs(durationMs)
    completeCalled.current = false
  }, [durationMs, resetKey])

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs((current) => {
        const next = clamp(current - 10, 0, durationMs)

        if (next === 0 && !completeCalled.current) {
          completeCalled.current = true
          onComplete?.()
        }

        return next
      })
    }, 10)

    return () => clearInterval(timer)
  }, [durationMs, onComplete])

  return (
    <p className={className}>
      {formatTimer(remainingMs)}
    </p>
  )
}

export default CountdownText
