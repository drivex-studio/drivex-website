'use client'
import { useLayoutEffect, useEffect } from 'react'
import { getLenis, getCssScrollLocked, setCssScrollLocked } from '@/providers/LenisProvider'
import { usePreloader } from '@/providers/PreloaderProvider'

export function PreloaderScrollLock() {
  const { phase, isInitialLoad } = usePreloader()

  useLayoutEffect(setupScroll, [])

  useEffect(() => {
    let shouldLock = isInitialLoad && 'hidden' !== phase
    let lenis = getLenis()
    
    if (shouldLock) {
      if (!getCssScrollLocked()) {
        setCssScrollLocked(true)
      }
      lenis?.stop()
    } else if ('hidden' === phase) {
      setCssScrollLocked(false)
      lenis?.start()
    }
  }, [phase, isInitialLoad])

  return null
}

function setupScroll() {
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  setCssScrollLocked(true)
}