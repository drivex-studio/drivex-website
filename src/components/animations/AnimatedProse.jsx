"use client";

import React, { createContext, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion' 
import { animate } from 'framer-motion' 
import { easingDefinitionToFunction } from '@/libs/constants/easings' 
import { cx } from '@/libs/utils/className'

export function stagger(
  delay = 0.1,
  { startDelay = 0, from = 0, ease } = {}
) {
  return (index, total) => {
    let distance =
      delay *
      Math.abs(
        (typeof from === 'number'
          ? from
          : function (fromStr, totalElements) {
              if (fromStr === 'first') return 0
              const lastIndex = totalElements - 1
              return fromStr === 'last' ? lastIndex : lastIndex / 2
            }(from, total)) - index
      )
    
    if (ease) {
      const maxDelay = total * delay
      distance = easingDefinitionToFunction(ease)(distance / maxDelay) * maxDelay
    }

    return startDelay + distance
  }
}

export const AnimatedProseContext = createContext(false)

export function AnimatedProse({
  children,
  className,
  staggerDelay = 0.03,
  duration = 0.5,
  delay = 0,
  margin = '0px 0px -10% 0px',
}) {
  const [isInView, setIsInView] = useState(false)
  const [linesReady, setLinesReady] = useState(false)
  const containerRef = useRef(null)
  const hasAnimated = useRef(false)
  
  useEffect(() => {
    if (!containerRef.current) return

    const checkLines = () => {
      const lines = containerRef.current?.querySelectorAll('.split-line')
      if (lines && lines.length > 0) {
        setLinesReady(true)
        return true
      }
      return false
    }

    if (checkLines()) return

    const interval = setInterval(() => {
      if (checkLines()) clearInterval(interval)
    }, 50)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setLinesReady(true) 
    }, 500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isInView || !linesReady || !containerRef.current || hasAnimated.current) {
      return
    }
    const lines = containerRef.current.querySelectorAll('.split-line')
    if (lines.length === 0) return
    hasAnimated.current = true
    containerRef.current.querySelectorAll('.invisible').forEach((el) => {
      el.style.visibility = 'visible'
    })

    const controls = animate(
      Array.from(lines),
      { y: ['100%', '0%'] },
      {
        delay: stagger(staggerDelay, { startDelay: delay }),
        duration: duration,
        ease: [0.33, 1, 0.68, 1],
      }
    )

    return () => {
      controls?.cancel()
    }
  }, [isInView, linesReady, staggerDelay, duration, delay])

  const onViewportEnter = () => setIsInView(true)

  return (
    <AnimatedProseContext.Provider value={true}>
      <motion.div
        ref={containerRef}
        onViewportEnter={onViewportEnter}
        viewport={{ once: true, margin: margin }}
        className={cx(className)}
      >
        {children}
      </motion.div>
    </AnimatedProseContext.Provider>
  )
}
