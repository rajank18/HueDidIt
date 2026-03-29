import { motion } from 'framer-motion'
import CountdownText from './CountdownText'
import ColorSlider from './ColorSlider'

function MatchPhase({
  guessColor,
  onGuessChange,
  onComplete,
  roundId,
  durationMs,
}) {
  const guessCss = `hsla(${guessColor.h} ${guessColor.s}% 50% / ${guessColor.a}%)`

  const hueGradient =
    'linear-gradient(to right, hsl(0 95% 55%), hsl(60 95% 55%), hsl(120 95% 52%), hsl(180 95% 50%), hsl(240 95% 58%), hsl(300 95% 56%), hsl(360 95% 55%))'
  const saturationGradient = `linear-gradient(to right, hsla(${guessColor.h} 8% 55% / ${guessColor.a}%), hsla(${guessColor.h} 100% 52% / ${guessColor.a}%))`
  const alphaGradient = `linear-gradient(to right, hsla(${guessColor.h} ${guessColor.s}% 50% / 0%), hsla(${guessColor.h} ${guessColor.s}% 50% / 100%))`

  return (
    <motion.section
      key={`match-${roundId}`}
      className="phase-panel match-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="phase-header">
        <p className="phase-label">MATCH IT</p>
        <CountdownText
          durationMs={durationMs}
          onComplete={onComplete}
          resetKey={`match-${roundId}`}
          className="timer-chip"
        />
      </div>

      <motion.div
        layout
        className="match-grid"
      >
        <div className="slider-stack">
          <ColorSlider
            label="HUE"
            value={guessColor.h}
            min={0}
            max={360}
            onChange={(value) => onGuessChange('h', value)}
            gradient={hueGradient}
            index={0}
          />
          <ColorSlider
            label="SATURATION"
            value={guessColor.s}
            min={0}
            max={100}
            onChange={(value) => onGuessChange('s', value)}
            gradient={saturationGradient}
            index={1}
            valueSuffix="%"
          />
          <ColorSlider
            label="TRANSPARENCY"
            value={guessColor.a}
            min={0}
            max={100}
            onChange={(value) => onGuessChange('a', value)}
            gradient={alphaGradient}
            index={2}
            valueSuffix="%"
          />
        </div>

        <div className="preview-wrap">
          <motion.div
            layoutId="color-block"
            className="color-square"
            style={{
              backgroundColor: guessCss,
              transition: 'background-color 200ms ease',
            }}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

export default MatchPhase
