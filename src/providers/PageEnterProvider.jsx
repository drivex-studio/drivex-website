'use client'

import { createContext, useState, useRef, useEffect, useContext } from 'react'
import { usePageTransition } from '@/hooks/usePageTransition'
import { usePreloader } from '@/providers/PreloaderProvider'

const PageEnterContext = createContext(null)

function sortByPriority(a, b) {
  return a.priority - b.priority
}

export function PageEnterProvider({ children }) {
  const { phase: pageTransitionPhase } = usePageTransition()
  const { phase: preloaderPhase } = usePreloader()
  
  const [enterPhase, setEnterPhase] = useState('waiting')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const registryRef = useRef(new Map())
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const register = (id, trigger, priority = 0) => {
    registryRef.current.set(id, { id, trigger, priority })
  }

  const unregister = (id) => {
    registryRef.current.delete(id)
  }

  const triggerAll = () => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true
    setEnterPhase('entering')

    const entries = Array.from(registryRef.current.values())
    entries.sort(sortByPriority)

    let currentPriority = -Infinity
    let delayAccumulator = 0

    for (const entry of entries) {
      if (entry.priority > currentPriority) {
        currentPriority = entry.priority
        if (delayAccumulator > 0) {
          delayAccumulator += 0.08
        }
      }
      entry.trigger(delayAccumulator)
    }

    setTimeout(() => {
      setEnterPhase('complete')
    }, 1000 * (delayAccumulator + 1))
  }

  useEffect(() => {
    const isPreloaderDone = preloaderPhase === 'revealing' || preloaderPhase === 'hidden'
    if ((pageTransitionPhase === 'exiting' || pageTransitionPhase === 'idle') && enterPhase === 'waiting' && isPreloaderDone) {
      const timer = setTimeout(() => {
        triggerAll()
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [pageTransitionPhase, preloaderPhase, enterPhase, triggerAll])

  useEffect(() => {
    if (pageTransitionPhase === 'entering' || pageTransitionPhase === 'holding') {
      setEnterPhase('waiting')
      hasTriggeredRef.current = false
    }
  }, [pageTransitionPhase])

  const contextValue = {
    phase: enterPhase,
    register,
    unregister,
    prefersReducedMotion
  }

  return (
    <PageEnterContext.Provider value={contextValue}>
      {children}
    </PageEnterContext.Provider>
  )
}

const defaultContextValue = {
  phase: 'complete',
  register: () => {},
  unregister: () => {},
  prefersReducedMotion: false
}

export function usePageEnterContext() {
  return useContext(PageEnterContext) ?? defaultContextValue
}