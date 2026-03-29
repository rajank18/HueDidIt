import { useCallback, useMemo, useState } from 'react'

const PHASES = {
  START: 'start',
  MEMORIZE: 'memorize',
  MATCH: 'match',
  SCORE: 'score',
}

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomTargetColor = () => ({
  h: randomInt(0, 360),
  s: randomInt(35, 100),
  a: randomInt(35, 100),
})

const randomGuessColor = (target) => {
  let guess = {
    h: 360,
    s: 100,
    a: 100,
  }

  // Avoid accidental perfect starts.
  if (guess.h === target.h && guess.s === target.s && guess.a === target.a) {
    guess = {
      h: 320,
      s: 95,
      a: 95,
    }
  }

  return guess
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const hueDiff = (h1, h2) => {
  const diff = Math.abs(h1 - h2)
  return Math.min(diff, 360 - diff)
}

const channelLightness = (color) => {
  if (typeof color.l === 'number') {
    return color.l
  }

  if (typeof color.a === 'number') {
    return color.a
  }

  return 50
}

const CHANNEL_WEIGHTS = {
  hue: 4,
  saturation: 3,
  lightness: 3,
}

export const getScoreGrade = (scoreValue) => {
  if (scoreValue >= 9.9) {
    return {
      label: 'perfect!',
      emoji: '✦',
      reaction: 'Pixel-perfect. You are a color wizard.',
      color: '#16A34A',
    }
  }

  if (scoreValue >= 8.7) {
    return {
      label: 'incredible',
      emoji: '✴︎',
      reaction: 'Super close. That was silky smooth.',
      color: '#22C55E',
    }
  }

  if (scoreValue >= 7.2) {
    return {
      label: 'great',
      emoji: '✌︎',
      reaction: 'Lovely match. Your eye is dialed in.',
      color: '#84CC16',
    }
  }

  if (scoreValue >= 5.6) {
    return {
      label: 'good',
      emoji: '🖒',
      reaction: 'Solid attempt. You are getting warmer.',
      color: '#F59E0B',
    }
  }

  if (scoreValue >= 4) {
    return {
      label: 'rough',
      emoji: ':/',
      reaction: 'A bit off, but the vibe is there.',
      color: '#F97316',
    }
  }

  return {
    label: 'yikes',
    emoji: '⊘',
    reaction: 'Chaos mode. Take a breath and try again.',
    color: '#EF4444',
  }
}

export const calculateScore = (target, guess) => {
  const targetLightness = channelLightness(target)
  const guessLightness = channelLightness(guess)

  const hDiff = hueDiff(target.h, guess.h)
  const sDiff = Math.abs(target.s - guess.s)
  const lDiff = Math.abs(targetLightness - guessLightness)

  const baseHueAccuracy = clamp(1 - hDiff / 180, 0, 1)
  const satAccuracy = clamp(1 - sDiff / 100, 0, 1)
  const lightnessAccuracy = clamp(1 - lDiff / 100, 0, 1)

  // Hue loses meaning near grayscale; reduce hue penalty smoothly as saturation drops.
  const hueRelevance = Math.pow(clamp(target.s / 100, 0, 1), 0.7)
  const hueAccuracy = clamp(1 - (1 - baseHueAccuracy) * hueRelevance, 0, 1)

  const weightedHue = hueAccuracy * CHANNEL_WEIGHTS.hue
  const weightedSat = satAccuracy * CHANNEL_WEIGHTS.saturation
  const weightedLightness = lightnessAccuracy * CHANNEL_WEIGHTS.lightness
  const score = clamp(weightedHue + weightedSat + weightedLightness, 0, 10)

  return {
    score,
    channelAccuracy: {
      hue: hueAccuracy,
      saturation: satAccuracy,
      lightness: lightnessAccuracy,
    },
    rawDiff: {
      hueDegrees: hDiff,
      saturationPercent: sDiff,
      lightnessPercent: lDiff,
    },
    weightedPoints: {
      hue: weightedHue,
      saturation: weightedSat,
      lightness: weightedLightness,
    },
    hueContext: {
      relevance: hueRelevance,
      targetSaturation: target.s,
    },
    grade: getScoreGrade(score),
  }
}

const runScoreEdgeCaseTests = () => {
  const perfect = calculateScore(
    { h: 210, s: 68, l: 44 },
    { h: 210, s: 68, l: 44 },
  )

  const oppositeHueGrays = calculateScore(
    { h: 5, s: 0, l: 52 },
    { h: 185, s: 0, l: 52 },
  )

  const oppositeHueVivid = calculateScore(
    { h: 30, s: 100, l: 50 },
    { h: 210, s: 100, l: 50 },
  )

  const hueMatchWrongOthers = calculateScore(
    { h: 120, s: 92, l: 82 },
    { h: 120, s: 8, l: 12 },
  )

  console.log('[WhatTheHue:ScoreTest] perfect match', perfect)
  console.log('[WhatTheHue:ScoreTest] opposite-hue grays', oppositeHueGrays)
  console.log('[WhatTheHue:ScoreTest] opposite-hue vivid', oppositeHueVivid)
  console.log('[WhatTheHue:ScoreTest] hue match wrong sat/light', hueMatchWrongOthers)
}

if (typeof globalThis !== 'undefined' && !globalThis.__whatTheHueScoreTestRan) {
  globalThis.__whatTheHueScoreTestRan = true
  runScoreEdgeCaseTests()
}

export const useGameState = () => {
  const [phase, setPhase] = useState(PHASES.START)
  const [roundId, setRoundId] = useState(0)
  const [targetColor, setTargetColor] = useState(() => randomTargetColor())
  const [guessColor, setGuessColor] = useState(() => randomGuessColor(targetColor))

  const scoreData = useMemo(
    () => calculateScore(targetColor, guessColor),
    [guessColor, targetColor],
  )

  const startGame = useCallback(() => {
    const nextTarget = randomTargetColor()
    setTargetColor(nextTarget)
    setGuessColor(randomGuessColor(nextTarget))
    setPhase(PHASES.MEMORIZE)
    setRoundId((current) => current + 1)
  }, [])

  const startMatchPhase = useCallback(() => {
    setPhase(PHASES.MATCH)
  }, [])

  const submitGuess = useCallback(() => {
    setPhase((current) =>
      current === PHASES.MATCH ? PHASES.SCORE : current,
    )
  }, [])

  const setGuessValue = useCallback((key, value) => {
    setGuessColor((current) => ({
      ...current,
      [key]: value,
    }))
  }, [])

  const playAgain = useCallback(() => {
    const nextTarget = randomTargetColor()
    setTargetColor(nextTarget)
    setGuessColor(randomGuessColor(nextTarget))
    setPhase(PHASES.MEMORIZE)
    setRoundId((current) => current + 1)
  }, [])

  const goToStart = useCallback(() => {
    setPhase(PHASES.START)
  }, [])

  return {
    phase,
    roundId,
    targetColor,
    guessColor,
    scoreData,
    startGame,
    setGuessValue,
    startMatchPhase,
    submitGuess,
    playAgain,
    goToStart,
  }
}
