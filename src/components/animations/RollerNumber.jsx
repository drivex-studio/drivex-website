'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useEffect, useCallback } from 'react'
import { usePageTransition } from '@/hooks/usePageTransition'

gsap.registerPlugin(ScrollTrigger)

const digitsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function renderDigitC(value) {
  return (
    <div key={`c-${value}`} className="flex items-center justify-center leading-none" style={{ height: "1em", fontVariantNumeric: "tabular-nums" }}>
      {value}
    </div>
  )
}

function renderDigitB(value) {
  return (
    <div key={`b-${value}`} className="flex items-center justify-center leading-none" style={{ height: "1em", fontVariantNumeric: "tabular-nums" }}>
      {value}
    </div>
  )
}

function renderDigitA(value) {
  return (
    <div key={`a-${value}`} className="flex items-center justify-center leading-none" style={{ height: "1em", fontVariantNumeric: "tabular-nums" }}>
      {value}
    </div>
  )
}

export function RollerNumber(props) {
  const {
    value,
    className,
    suffix,
    minDigits = 2,
    triggerMode = "scroll",
    triggerElement,
    delay = 0,
    duration = 1.5,
    stagger = .08
  } = props

  const containerRef = useRef(null)
  const hasTriggeredRef = useRef(false)
  const { phase } = usePageTransition()
  const isIdle = phase === "idle"

  let digitArray = Math.round(value).toString().split("").map(Number)
  while (digitArray.length < minDigits) {
    digitArray.unshift(0)
  }

  const triggerAnimation = () => {
    if (hasTriggeredRef.current || !containerRef.current) return
    hasTriggeredRef.current = true
    const innerNodes = containerRef.current.querySelectorAll("[data-roller-inner]")
    if (innerNodes && innerNodes.length !== 0) {
      innerNodes.forEach((node, index) => {
        const digitValue = digitArray[index] ?? 0
        gsap.fromTo(
          node,
          { y: "-10em" },
          {
            y: `${-20 - digitValue}em`,
            duration: duration,
            delay: delay + (digitArray.length - 1 - index) * stagger,
            ease: "expo.inOut"
          }
        )
      })
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    if (triggerMode === "immediate") {
      triggerAnimation()
      return
    }
    if (!isIdle) return
    
    hasTriggeredRef.current = false
    const triggerTarget = triggerElement?.current ?? containerRef.current
    
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: triggerTarget,
      start: "top bottom",
      once: true,
      invalidateOnRefresh: true,
      onEnter: triggerAnimation
    })
    
    return () => {
      scrollTriggerInstance.kill()
    }
  }, [triggerMode, triggerElement, triggerAnimation, isIdle])

  const wrapperClassName = `flex items-start justify-start overflow-hidden leading-none ${className === undefined ? "" : className}`

  const columns = digitArray.map((digit, index) => (
    <div
      key={`${index}-${digitArray.length}`}
      className="relative flex flex-col items-center justify-start overflow-hidden"
      style={{ width: "1ch", height: "1em" }}
    >
      <div
        data-roller-inner={true}
        className="flex flex-col will-change-transform"
        style={{ transform: "translateY(-10em)" }}
      >
        {digitsArray.map(renderDigitA)}
        {digitsArray.map(renderDigitB)}
        {digitsArray.map(renderDigitC)}
      </div>
    </div>
  ))

  const suffixNode = suffix && (
    <span className="flex items-center leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
      {suffix}
    </span>
  )

  return (
    <div ref={containerRef} className={wrapperClassName} style={{ height: "1em" }}>
      {columns}
      {suffixNode}
    </div>
  )
}
