'use client'
import { useState, useRef, useEffect } from 'react'

export function useMousePosition(options) {
  let { lerp = .08, enabled = true, containerRef, refOnly = false } = options ?? {}

  let [mouseX, setMouseX] = useState(0)
  let [mouseY, setMouseY] = useState(0)
  let [isHovering, setIsHovering] = useState(false)
  let mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let frameId

    if (!enabled) {
      if (!refOnly) {
        setMouseX(0)
        setMouseY(0)
      }
      mouseRef.current.x = 0
      mouseRef.current.y = 0
      setIsHovering(false)
      return
    }

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let localIsHovering = false

    let handleMouseMove = (e) => {
      let container = containerRef?.current
      if (container) {
        let rect = container.getBoundingClientRect()
        let xRatio = (e.clientX - rect.left) / rect.width
        let yRatio = (e.clientY - rect.top) / rect.height

        if (xRatio >= 0 && xRatio <= 1 && yRatio >= 0 && yRatio <= 1) {
          if (!localIsHovering) {
            localIsHovering = true
            setIsHovering(true)
          }
          targetX = 2 * xRatio - 1
          targetY = (1 - yRatio) * 2 - 1
        } else {
          if (localIsHovering) {
            localIsHovering = false
            setIsHovering(false)
            targetX = 0
            targetY = 0
          }
        }
      } else {
        targetX = (e.clientX / window.innerWidth) * 2 - 1
        targetY = (e.clientY / window.innerHeight) * 2 - 1
      }
      startAnimation()
    }

    let handleDocumentMouseLeave = () => {
      targetX = 0
      targetY = 0
      startAnimation()
    }

    let handleMouseEnter = () => {
      localIsHovering = true
      setIsHovering(true)
    }

    let handleMouseLeave = () => {
      localIsHovering = false
      setIsHovering(false)
      targetX = 0
      targetY = 0
      startAnimation()
    }

    let startAnimation = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(render)
      }
    }

    let render = () => {
      currentX += (targetX - currentX) * lerp
      currentY += (targetY - currentY) * lerp
      
      mouseRef.current.x = currentX
      mouseRef.current.y = currentY

      if (!refOnly) {
        setMouseX(currentX)
        setMouseY(currentY)
      }

      if (Math.abs(targetX - currentX) > 1e-4 || Math.abs(targetY - currentY) > 1e-4) {
        frameId = requestAnimationFrame(render)
      } else {
        frameId = 0
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleDocumentMouseLeave)

    let element = containerRef?.current
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
    } else {
      document.addEventListener('mouseenter', handleMouseEnter)
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleDocumentMouseLeave)
      
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      } else {
        document.removeEventListener('mouseenter', handleMouseEnter)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
      
      cancelAnimationFrame(frameId)
    }
  }, [lerp, enabled, containerRef, refOnly])

  return { mouseX, mouseY, isHovering, mouseRef }
}