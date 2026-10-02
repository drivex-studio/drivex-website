'use client'

import { useRef, useEffect } from 'react'
import { usePageEnterContext } from '@/providers/PageEnterProvider'

export function usePageEnter(trigger, options = {}) {
  const { priority = 0, skip = false } = options

  const {
    register,
    unregister,
    phase,
    prefersReducedMotion
  } = usePageEnterContext()

  const idRef = useRef(crypto.randomUUID())

  useEffect(() => {
    if (skip) return

    const id = idRef.current
    register(id, trigger, priority)

    return () => {
      unregister(id)
    }
  }, [register, unregister, trigger, priority, skip])

  const isEntering = phase === 'entering'
  const isComplete = phase === 'complete'

  return {
    phase,
    prefersReducedMotion,
    isEntering,
    isComplete
  }
}