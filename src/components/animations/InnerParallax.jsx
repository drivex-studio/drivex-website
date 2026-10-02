'use client'
import { composeRefs } from '@radix-ui/react-compose-refs'
import { motion } from 'framer-motion'
import { useScroll } from 'framer-motion'
import { useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cx } from '@/libs/utils/className'
import { screens } from '@/libs/constants/screens'
import { parseResponsiveValues } from '@/components/sanity/utils/parseResponsiveValues'

function formatPixelValue(e) {
  let t = e.trim()
  return /^\d+(\.\d+)?$/.test(t) ? `${t}px` : t
}

export function InnerParallax(props) {
  const {
    overflow,
    direction = 'y',
    className,
    ref,
    children,
    style,
    ...rest
  } = props

  const targetRef = useRef(null)

  const { styles: responsiveStyles, className: responsiveClassName } = (function (overflowVal) {
    const baseVal = typeof overflowVal === 'number' ? `${overflowVal}px` : overflowVal
    const parsed = parseResponsiveValues(baseVal)
    const keys = Object.keys(screens)
    const stylesObj = {}
    
    const defaultVal = formatPixelValue(parsed.DEFAULT?.value ?? baseVal)
    stylesObj['--parallax-overflow-DEFAULT'] = defaultVal
    let currentVal = defaultVal
    
    for (const key of keys) {
      const val = formatPixelValue(parsed[key]?.value || currentVal)
      stylesObj[`--parallax-overflow-${key}`] = val
      currentVal = val
    }
    
    return {
      styles: stylesObj,
      className: [
        '[--parallax-overflow:var(--parallax-overflow-DEFAULT)]',
        'sm:[--parallax-overflow:var(--parallax-overflow-sm)]',
        'md:[--parallax-overflow:var(--parallax-overflow-md)]',
        'lg:[--parallax-overflow:var(--parallax-overflow-lg)]',
        'xl:[--parallax-overflow:var(--parallax-overflow-xl)]',
        '2xl:[--parallax-overflow:var(--parallax-overflow-2xl)]',
      ],
    }
  })(overflow)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })

  const xTransform = useTransform(scrollYProgress, calculateX)
  const yTransform = useTransform(scrollYProgress, calculateY)

  const innerStyle = direction === 'x'
    ? {
        width: 'calc(100% + (2 * var(--parallax-overflow)))',
        left: 'calc(-1 * var(--parallax-overflow))',
        x: xTransform,
      }
    : {
        height: 'calc(100% + (2 * var(--parallax-overflow)))',
        top: 'calc(-1 * var(--parallax-overflow))',
        y: yTransform,
      }

  const mergedRef = composeRefs(ref, targetRef)
  const outerClassName = cx(['relative overflow-hidden', className, ...responsiveClassName])
  const outerStyle = {
    ...responsiveStyles,
    ...style,
  }

  return (
    <div ref={mergedRef} className={outerClassName} style={outerStyle} {...rest}>
      <motion.div style={innerStyle} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  )
}

function calculateY(e) {
  return `calc(var(--parallax-overflow) * ${2 * e - 1})`
}

function calculateX(e) {
  return `calc(var(--parallax-overflow) * ${2 * e - 1})`
}