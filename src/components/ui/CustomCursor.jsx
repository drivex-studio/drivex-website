'use client'
import { gsap, useGSAP } from '@/libs/vendor';
import { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { usePageTransitionContext } from '@/providers/PageTransitionProvider'
import { cx } from '@/libs/utils/className'

export default function CustomCursor({
  children,
  speed = 0.7,
  ease = 'expo.out',
  maxRotation = 35,
  rotationDecay = 0.92,
  velocityMultiplier = 0.5
}) {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorWrapperRef = useRef(null)
  const textRef = useRef(null)
  const leftStripesRef = useRef(null)
  const rightStripesRef = useRef(null)

  const mousePos = useRef({ x: 0, y: 0 })
  const prevMousePos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const currentRotation = useRef(0)
  const targetRotation = useRef(0)
  const rafId = useRef(null)
  const lastTime = useRef(0)

  const isVisible = useRef(false)
  const isHoveringText = useRef(false)
  const leaveTimeoutRef = useRef(null)

  const [opacityVisible, setOpacityVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(hover: none)').matches)
    setIsMounted(true)
  }, [])

  const { phase } = usePageTransitionContext()
  const { contextSafe } = useGSAP({ scope: containerRef })

  const updateCursorPosition = useCallback((x, y, instant = false) => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: x,
        y: y,
        force3D: true,
        overwrite: true,
        ease: ease,
        duration: instant ? 0 : speed
      })
    }
  }, [ease, speed])

  const showCursor = useCallback(() => {
    if (!isVisible.current) {
      isVisible.current = true
      setOpacityVisible(true)
    }
  }, [])

  const hideCursor = useCallback(() => {
    if (isVisible.current) {
      isVisible.current = false
      setOpacityVisible(false)
    }
  }, [])

  const createStripesHTML = count =>
    count <= 0 ? '' : Array.from({ length: count }, () => '<div class="h-full w-[6px] bg-brand"></div>').join('')

  const handleTextEnter = contextSafe((text, bg, color, stripesLeft = 0, stripesRight = 0) => {
    if (textRef.current) {
      gsap.killTweensOf(textRef.current)
      if (leftStripesRef.current) gsap.killTweensOf(leftStripesRef.current)
      if (rightStripesRef.current) gsap.killTweensOf(rightStripesRef.current)

      textRef.current.innerHTML = text
      isHoveringText.current = true
      textRef.current.style.backgroundColor = bg || ''
      textRef.current.style.color = color || ''

      if (leftStripesRef.current) {
        leftStripesRef.current.innerHTML = createStripesHTML(stripesLeft)
        gsap.fromTo(leftStripesRef.current, {
          scale: 0
        }, {
          scale: 1,
          duration: 0.35,
          ease: 'back.out(1.7)',
          force3D: true
        })
      }

      if (rightStripesRef.current) {
        rightStripesRef.current.innerHTML = createStripesHTML(stripesRight)
        gsap.fromTo(rightStripesRef.current, {
          scale: 0
        }, {
          scale: 1,
          duration: 0.35,
          ease: 'back.out(1.7)',
          force3D: true
        })
      }

      gsap.fromTo(textRef.current, {
        scale: 0
      }, {
        scale: 1,
        duration: 0.35,
        ease: 'back.out(1.7)',
        force3D: true
      })
    }
  })

  const handleTextLeave = contextSafe(() => {
    if (textRef.current) {
      gsap.killTweensOf(textRef.current)
      if (leftStripesRef.current) gsap.killTweensOf(leftStripesRef.current)
      if (rightStripesRef.current) gsap.killTweensOf(rightStripesRef.current)

      isHoveringText.current = false

      if (leftStripesRef.current) {
        gsap.to(leftStripesRef.current, {
          scale: 0,
          duration: 0.25,
          ease: 'power2.inOut',
          force3D: true,
          onComplete: () => {
            if (leftStripesRef.current) {
              leftStripesRef.current.innerHTML = ''
            }
          }
        })
      }

      if (rightStripesRef.current) {
        gsap.to(rightStripesRef.current, {
          scale: 0,
          duration: 0.25,
          ease: 'power2.inOut',
          force3D: true,
          onComplete: () => {
            if (rightStripesRef.current) {
              rightStripesRef.current.innerHTML = ''
            }
          }
        })
      }

      gsap.to(textRef.current, {
        scale: 0,
        duration: 0.25,
        ease: 'power2.inOut',
        force3D: true,
        onComplete: () => {
          if (!isHoveringText.current && textRef.current) {
            textRef.current.innerHTML = ''
            textRef.current.style.backgroundColor = ''
            textRef.current.style.color = ''
          }
        }
      })
    }
  })

  useEffect(() => {
    if (phase === 'entering' || phase === 'holding') {
      handleTextLeave()
    }
  }, [phase, handleTextLeave])

  useGSAP(() => {
    if (isTouchDevice || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !cursorRef.current || !textRef.current || !containerRef.current || phase !== 'idle') {
      return
    }

    gsap.set(textRef.current, {
      scale: 0,
      force3D: true
    })

    updateCursorPosition(-window.innerWidth, -window.innerHeight, true)

    const elements = containerRef.current.querySelectorAll('[data-cursor-text]')
    const listeners = []

    elements.forEach(element => {
      const text = element.getAttribute('data-cursor-text')
      if (!text) return

      const handleEnter = () => {
        handleTextEnter(
          text,
          element.getAttribute('data-cursor-bg'),
          element.getAttribute('data-cursor-color'),
          Number.parseInt(element.getAttribute('data-cursor-stripes-left') ?? '0', 10) || 0,
          Number.parseInt(element.getAttribute('data-cursor-stripes-right') ?? '0', 10) || 0
        )
      }

      const handleLeave = () => {
        handleTextLeave()
      }

      element.addEventListener('mouseenter', handleEnter)
      element.addEventListener('mouseleave', handleLeave)
      listeners.push({
        element,
        handleEnter,
        handleLeave
      })
    })

    const handleMouseMove = e => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      updateCursorPosition(mousePos.current.x, mousePos.current.y)
      showCursor()
    }

    const handleWindowEnter = () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
      }
      showCursor()
    }

    const handleWindowLeave = () => {
      leaveTimeoutRef.current = setTimeout(() => {
        hideCursor()
      }, 300)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleWindowEnter)
    document.addEventListener('mouseleave', handleWindowLeave)

    const rafLoop = time => {
      if (!lastTime.current) {
        lastTime.current = time
      }
      const dt = time - lastTime.current
      lastTime.current = time

      const dx = mousePos.current.x - prevMousePos.current.x

      if (dt > 0) {
        velocity.current.x = 0.7 * velocity.current.x + 0.3 * dx
      }

      prevMousePos.current.x = mousePos.current.x
      prevMousePos.current.y = mousePos.current.y

      targetRotation.current = Math.max(-maxRotation, Math.min(maxRotation, velocity.current.x * velocityMultiplier))

      if (isHoveringText.current) {
        currentRotation.current += (targetRotation.current - currentRotation.current) * 0.2
      } else {
        currentRotation.current *= rotationDecay
      }

      if (cursorWrapperRef.current) {
        gsap.set(cursorWrapperRef.current, {
          rotation: currentRotation.current,
          force3D: true
        })
      }

      rafId.current = requestAnimationFrame(rafLoop)
    }

    rafId.current = requestAnimationFrame(rafLoop)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleWindowEnter)
      document.removeEventListener('mouseleave', handleWindowLeave)

      for (const { element, handleEnter, handleLeave } of listeners) {
        element.removeEventListener('mouseenter', handleEnter)
        element.removeEventListener('mouseleave', handleLeave)
      }

      if (cursorRef.current) gsap.killTweensOf(cursorRef.current)
      if (cursorWrapperRef.current) gsap.killTweensOf(cursorWrapperRef.current)
      if (textRef.current) gsap.killTweensOf(textRef.current)
    }
  }, {
    scope: containerRef,
    dependencies: [isTouchDevice, speed, ease, maxRotation, rotationDecay, velocityMultiplier, phase]
  })

  const cursorPortal = isMounted && !isTouchDevice && createPortal(
    <div
      ref={cursorRef}
      className={cx(
        'pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform',
        'opacity-0 transition-opacity duration-300 ease-out-expo',
        opacityVisible && 'opacity-100'
      )}
    >
      <div
        ref={cursorWrapperRef}
        className="pointer-events-none absolute top-[-32px] left-0 flex origin-bottom -translate-x-1/2 -translate-y-full items-stretch gap-[2px]"
      >
        <div ref={leftStripesRef} className="flex items-stretch gap-[2px]" />
        <div
          ref={textRef}
          className="whitespace-nowrap bg-brand px-8 py-4 text-center text-accent-sm text-black"
        />
        <div ref={rightStripesRef} className="flex items-stretch gap-[2px]" />
      </div>
    </div>,
    document.body
  )

  return (
    <>
      <div ref={containerRef} data-custom-cursor>
        {children}
      </div>
      {cursorPortal}
    </>
  )
}
