import { useMemo, useEffect } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { motion } from 'framer-motion'

const hslToRgb = (h, s, l) => {
  const saturation = s / 100
  const lightness = l / 100
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation
  const huePrime = h / 60
  const x = c * (1 - Math.abs((huePrime % 2) - 1))

  let r = 0
  let g = 0
  let b = 0

  if (huePrime >= 0 && huePrime < 1) {
    r = c
    g = x
  } else if (huePrime < 2) {
    r = x
    g = c
  } else if (huePrime < 3) {
    g = c
    b = x
  } else if (huePrime < 4) {
    g = x
    b = c
  } else if (huePrime < 5) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  const m = lightness - c / 2

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase()

const hslaToHex = (h, s, l, aPercent) => {
  const { r, g, b } = hslToRgb(h, s, l)
  const alpha = Math.round((aPercent / 100) * 255)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`
}

function ScorePhase({ targetColor, guessColor, scoreData, onPlayAgain, roundId }) {
  const autoNextMs = 4200
  const targetCss = `hsla(${targetColor.h} ${targetColor.s}% 50% / ${targetColor.a}%)`
  const guessCss = `hsla(${guessColor.h} ${guessColor.s}% 50% / ${guessColor.a}%)`
  const targetHex = hslaToHex(targetColor.h, targetColor.s, 50, targetColor.a)
  const guessHex = hslaToHex(guessColor.h, guessColor.s, 50, guessColor.a)
  const grade = scoreData.grade

  const breakdown = useMemo(
    () => [
      {
        label: 'Hue',
        accuracy: scoreData.channelAccuracy.hue,
        offBy: `${scoreData.rawDiff.hueDegrees.toFixed(0)}° off`,
      },
      {
        label: 'Sat',
        accuracy: scoreData.channelAccuracy.saturation,
        offBy: `${scoreData.rawDiff.saturationPercent.toFixed(0)}% off`,
      },
      {
        label: 'Lightness',
        accuracy: scoreData.channelAccuracy.lightness,
        offBy: `${scoreData.rawDiff.lightnessPercent.toFixed(0)}% off`,
      },
    ],
    [scoreData],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onPlayAgain()
    }, autoNextMs)

    return () => clearTimeout(timeoutId)
  }, [onPlayAgain])

  const scoreSpring = useSpring({
    from: { value: 0 },
    to: { value: scoreData.score },
    config: { tension: 170, friction: 28 },
  })

  return (
    <motion.section
      key={`score-${roundId}`}
      className="phase-panel score-wrap"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="phase-header">
        <p className="phase-label">RESULT</p>
      </div>

      <div className="score-card">
        <p className="grade-line" style={{ color: grade.color }}>
          <span>{grade.emoji}</span>
          <span>{grade.label}</span>
        </p>
        <p className="grade-reaction">{grade.reaction}</p>

        <div className="comparison-headings">
          <p>Original</p>
          <p>Yours</p>
        </div>

        <div className="comparison-codes">
          <p className="hex-pill">{targetHex}</p>
          <p className="hex-pill">{guessHex}</p>
        </div>

        <div className="comparison-shell">
          <motion.div
            className="comparison-half"
            style={{ backgroundColor: targetCss }}
            initial={{ width: '0%' }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="comparison-half"
            style={{ backgroundColor: guessCss }}
            initial={{ width: '0%' }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.5, delay: 0.12 }}
          />
        </div>

        <div className="breakdown-stack">
          {breakdown.map((item, index) => (
            <div key={item.label} className="breakdown-item">
              <div className="breakdown-meta">
                <p>{item.label}</p>
                <p>{item.offBy}</p>
              </div>
              <div className="breakdown-track">
                <motion.div
                  className="breakdown-fill"
                  style={{ backgroundColor: grade.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.accuracy * 100}%` }}
                  transition={{ duration: 0.48, delay: 0.08 * index }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="score-footer">
          <animated.p className="score-line" style={{ color: grade.color }}>
            {scoreSpring.value.to((value) => `${value.toFixed(2)} / 10`)}
          </animated.p>

          <motion.button
            type="button"
            onClick={onPlayAgain}
            className="play-again-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.span
              className="play-again-btn-fill"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: autoNextMs / 1000, ease: 'linear' }}
            />
            <span className="play-again-btn-label">Next Round</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}

export default ScorePhase
