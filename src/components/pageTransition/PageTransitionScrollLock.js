'use client'

import { useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { usePageTransition } from '@/hooks/usePageTransition'
import '@/providers/PageTransitionProvider'
import '@/components/pageTransition/PageTransitionOverlay'
import '@/components/pageTransition/PageTransitionRectangles'

export function PageTransitionScrollLock() {
  const lenis = useLenis()
  const { phase } = usePageTransition()

  useEffect(() => {
    if (lenis) {
      if (phase === 'entering' || phase === 'holding' || phase === 'exiting') {
        lenis.stop()
      } else if (phase === 'idle') {
        lenis.start()
      }
    }
  }, [lenis, phase])

  return null
}

import '@/components/shared/SyncBodyTheme'