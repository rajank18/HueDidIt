import { motion } from 'framer-motion'
import CountdownText from './CountdownText'

function MemorizePhase({ targetColor, onComplete, roundId }) {
  const targetColorCss = `hsla(${targetColor.h} ${targetColor.s}% 50% / ${targetColor.a}%)`

  return (
    <motion.section
      key={`memorize-${roundId}`}
      className="phase-panel memorize-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="phase-header">
        <p className="phase-label">MEMORIZE</p>
        <CountdownText
          durationMs={5000}
          onComplete={onComplete}
          resetKey={`memorize-${roundId}`}
          className="timer-chip"
        />
      </div>

      <motion.div
        layoutId="color-block"
        className="color-square"
        style={{
          backgroundColor: targetColorCss,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 16 }}
      />
    </motion.section>
  )
}

export default MemorizePhase
