'use client'
import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

let lenisInstance = null
let isScrollLocked = false

export function getLenis() {
  return lenisInstance
}

export function setCssScrollLocked(locked) {
  if (locked !== isScrollLocked) {
    isScrollLocked = locked
    if (locked) {
      document.documentElement.classList.add('scroll-locked')
    } else {
      document.documentElement.classList.remove('scroll-locked')
    }
  }
}

export function getCssScrollLocked() {
  return isScrollLocked
}

export function scrollToTop(immediate = true) {
  let instance = lenisInstance
  if (instance) {
    instance.scrollTo(0, { immediate })
  } else {
    window.scrollTo(0, 0)
  }
}

function clearLenis() {
  lenisInstance = null
}

function GlobalLenisUpdater() {
  const currentLenis = useLenis()

  useEffect(() => {
    lenisInstance = currentLenis ?? null
    return clearLenis
  }, [currentLenis])

  return null
}

function easing(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function LenisProvider(props) {
  const options = { anchors: { duration: 1.2, easing } }

  return (
    <ReactLenis root={true} options={options} {...props}>
      <GlobalLenisUpdater />
      {props.children}
    </ReactLenis>
  )
}

export { LenisProvider as Lenis }