'use client'

import { useState, useEffect } from 'react'
export function GridOverlay() {
  const [isVisible, setIsVisible] = useState(false)
  const [animationState, setAnimationState] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && 'g' === e.key) {
        e.preventDefault()
        setIsVisible((prev) => {
          setAnimationState(prev ? 'out' : 'in')
          return !prev
        })
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if ('out' !== animationState) return
    
    const timer = setTimeout(() => {
      setAnimationState(null)
    }, 1830)
    
    return () => clearTimeout(timer)
  }, [animationState, 1830])

  const visibility = isVisible || 'out' === animationState ? 'visible' : 'hidden'
  const containerStyle = { visibility }
  const columns = Array.from({ length: 12 })

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={containerStyle} aria-hidden="true">
      <div className="grid-container h-full">
        <div className="grid-layout h-full">
          {columns.map((_, i) => (
            <div
              key={`col-${i}`}
              className="h-full origin-top bg-brand/10"
              style={{
                transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                transitionProperty: 'transform',
                transitionDuration: '1500ms',
                transitionTimingFunction: 'var(--ease-power3-in-out)',
                transitionDelay: `${30 * i}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}