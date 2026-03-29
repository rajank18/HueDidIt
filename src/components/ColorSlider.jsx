import { motion } from 'framer-motion'

function ColorSlider({
  label,
  value,
  min,
  max,
  onChange,
  gradient,
  valueSuffix = '',
  index = 0,
}) {
  return (
    <motion.div
      className="slider-card"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
    >
      <div className="slider-meta">
        <span className="slider-label">{label}</span>
        <span className="slider-value">
          {value}
          {valueSuffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="zen-range"
        style={{ background: gradient }}
      />
    </motion.div>
  )
}

export default ColorSlider
