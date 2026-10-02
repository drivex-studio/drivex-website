'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePageTransitionContext } from '@/providers/PageTransitionProvider'

export function PageTransitionRectangles() {
  const { phase } = usePageTransitionContext()
  const [isMounted, setIsMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  if (!isMounted || prefersReducedMotion) return null

  const isTransitioning = phase !== "idle"

  const getRectangleStyle = (index) => {
    const delay = phase === "entering" ? 650 + 60 * index : phase === "exiting" ? 60 * index : 0
    const transform = phase === "entering" || phase === "holding" ? "translateY(0%)" : phase === "exiting" ? "translateY(-110%)" : "translateY(110%)"
    const isAnimating = phase === "entering" || phase === "exiting"

    return {
      width: 16,
      height: 16,
      backgroundColor: "#141314",
      transform,
      transitionProperty: "transform",
      transitionDuration: isAnimating ? "350ms" : "0ms",
      transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      transitionDelay: isAnimating ? `${delay}ms` : "0ms",
      willChange: isAnimating ? "transform" : undefined
    }
  }

  const visibility = isTransitioning ? "visible" : "hidden"

  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    zIndex: 10001,
    pointerEvents: "none",
    visibility
  }

  const wrapperStyle = {
    display: "flex",
    gap: 2,
    overflow: "hidden"
  }

  const rectangleKeys = ["r0", "r1", "r2", "r3"]

  const content = (
    <div style={wrapperStyle}>
      {rectangleKeys.map((key, index) => (
        <div key={key} style={getRectangleStyle(index)} />
      ))}
    </div>
  )

  return createPortal(
    <div style={containerStyle}>
      {content}
    </div>,
    document.body
  )
}