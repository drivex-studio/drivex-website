'use client'

import { useState } from 'react'
import theme from '@/libs/constants/screens'
import { useIsoLayoutEffect } from '@/hooks/shared/useIsoLayoutEffect'

function useMediaQuery(query, initializeWithValue) {
  const [matches, setMatches] = useState(initializeWithValue !== undefined && initializeWithValue)
  const [ready, setReady] = useState(false)

  useIsoLayoutEffect(() => {
    let isMounted = true
    const mediaQueryString = query.substring(query.indexOf('(')).trim()
    const mql = window.matchMedia(mediaQueryString)

    const handleChange = () => {
      if (isMounted) {
        setMatches(mql.matches)
      }
    }

    mql.addEventListener('change', handleChange)
    handleChange()
    setReady(true)

    return () => {
      isMounted = false
      mql.removeEventListener('change', handleChange)
    }
  }, [query])

  return { matches, ready }
}

export function useBreakpoint(breakpoint, options) {
  const initializeWithValue = options?.initializeWithValue ?? false
  const { matches } = useMediaQuery(`(min-width: ${theme.screens[breakpoint]})`, initializeWithValue)
  
  return matches
}

export function useIsTouchDevice(options) {
  const { matches } = useMediaQuery('(pointer: coarse)', options?.initializeWithValue ?? false)
  
  return matches
}