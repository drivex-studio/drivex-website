'use client'

import { createContext, useState, useTransition, useRef, useEffect, useContext } from 'react'
import { scrollToTop } from '@/providers/LenisProvider'

const PageTransitionContext = createContext(null)
let gsapPromise = null

function loadGsap() {
  return gsapPromise || (gsapPromise = import('gsap/all'))
}

function clearScrollMemory() {
  const promise = loadGsap()
  if (promise) {
    promise.then(({ ScrollTrigger }) => {
      ScrollTrigger.clearScrollMemory()
    })
  }
}

function refreshScrollTrigger() {
  const promise = loadGsap()
  if (promise) {
    promise.then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh(true)
    })
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function PageTransitionProvider({ children }) {
  const [phase, setPhase] = useState("idle")
  const [isPending, startReactTransition] = useTransition()
  
  const timerRef = useRef(null)
  const pendingCallbackRef = useRef(null)
  const holdStartTimeRef = useRef(0)

  const clearTransitionTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleExit = () => {
    clearTransitionTimeout()
    if (!prefersReducedMotion()) {
      holdStartTimeRef.current = 0
      pendingCallbackRef.current = null
      setPhase("holding")
      clearScrollMemory()
      
      timerRef.current = window.setTimeout(() => {
        setPhase("exiting")
        timerRef.current = window.setTimeout(() => {
          setPhase("idle")
          refreshScrollTrigger()
        }, 1200)
      }, 100)
    }
  }

  const startTransition = (callback) => {
    clearTransitionTimeout()
    pendingCallbackRef.current = callback
    
    if (prefersReducedMotion()) {
      callback()
    } else {
      setPhase("entering")
      timerRef.current = window.setTimeout(() => {
        holdStartTimeRef.current = Date.now()
        setPhase("holding")
        clearScrollMemory()
        scrollToTop()
        
        startReactTransition(() => {
          pendingCallbackRef.current?.()
        })
      }, 1300)
    }
  }

  useEffect(() => {
    if (phase === "holding" && !isPending && holdStartTimeRef.current > 0) {
      const remainingTime = Math.max(0, 100 - (Date.now() - holdStartTimeRef.current))
      timerRef.current = window.setTimeout(() => {
        setPhase("exiting")
        holdStartTimeRef.current = 0
        timerRef.current = window.setTimeout(() => {
          setPhase("idle")
          refreshScrollTrigger()
        }, 1200)
      }, remainingTime)
    }
  }, [phase, isPending])

  useEffect(() => {
    const handlePopstate = () => {
      handleExit()
    }
    window.addEventListener("popstate", handlePopstate)
    return () => {
      window.removeEventListener("popstate", handlePopstate)
    }
  }, [handleExit])

  useEffect(() => {
    return () => {
      clearTransitionTimeout()
    }
  }, [clearTransitionTimeout])

  const contextValue = {
    phase,
    startTransition,
    isPending
  }

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}
    </PageTransitionContext.Provider>
  )
}

const defaultContextValue = {
  phase: "idle",
  startTransition: (t) => t(),
  isPending: false
}

export function usePageTransitionContext() {
  return useContext(PageTransitionContext) ?? defaultContextValue
}