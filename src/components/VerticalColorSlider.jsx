import { motion } from 'framer-motion'

function VerticalColorSlider({
  min,
  max,
  value,
  onChange,
  gradient,
  index,
  variant = 'default',
}) {
  return (
    <motion.div
      className={`vertical-slider-shell vertical-slider-${variant}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.36, delay: index * 0.12 }}
    >
      <input
        className="vertical-range"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ background: gradient }}
      />
    </motion.div>
  )
}

export default VerticalColorSlider
