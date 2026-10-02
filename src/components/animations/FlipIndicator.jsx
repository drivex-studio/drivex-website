
import { motion } from 'framer-motion'

const defaultFlipEase = [.68, -.3, .32, 1.1]
export function FlipIndicator(props) {
  const {
    layoutId,
    className = "h-12 w-12 bg-brand",
    duration,
    ease,
    rotate = 0
  } = props

  const resolvedDuration = duration ?? .8
  const resolvedEase = ease ?? defaultFlipEase
  const transitionConfig = {
    layout: { duration: resolvedDuration, ease: resolvedEase },
    rotate: { duration: resolvedDuration, ease: resolvedEase }
  }
  const animateConfig = { rotate: rotate }
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={transitionConfig}
      animate={animateConfig}
      style={{ flexShrink: 0 }}
    />
  )
}