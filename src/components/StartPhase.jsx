import { motion } from 'framer-motion'

function StartPhase({ onStart }) {
  return (
    <motion.section
      className="phase-panel start-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="start-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="phase-label">READY?</p>
        <h1 className="start-title">A tiny color ritual</h1>
        <p className="start-copy">
          Breathe, memorize the hue, then recreate it from feel.
        </p>

      <motion.button
        type="button"
        onClick={onStart}
        className="start-button"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        Start Playing
      </motion.button>
      </motion.div>
    </motion.section>
  )
}

export default StartPhase
