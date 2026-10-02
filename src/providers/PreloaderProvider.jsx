'use client'
import { createContext, useState, useEffect, useContext } from 'react'

const PreloaderContext = createContext(null)

export function PreloaderProvider({ children }) {
  const [phase, setPhase] = useState('loading')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  useEffect(() => {
    if (phase === 'revealing') {
      const timer = setTimeout(() => {
        setPhase('hidden')
        setIsInitialLoad(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const contextValue = { 
    phase, 
    setPhase, 
    isInitialLoad 
  }

  return (
    <PreloaderContext.Provider value={contextValue}>
      {children}
    </PreloaderContext.Provider>
  )
}

const defaultPreloaderValue = {
  phase: 'hidden',
  setPhase: () => {},
  isInitialLoad: false
}

export function usePreloader() {
  return useContext(PreloaderContext) ?? defaultPreloaderValue
}