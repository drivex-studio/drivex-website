'use client'
import { useLenis } from 'lenis/react'
import { 
  useRef, 
  useState, 
  useMemo,
  useEffect, 
  useCallback, 
  useLayoutEffect, 
  Fragment 
} from 'react'
import Link from 'next/link'
import { cx } from '@/libs/utils/className'
import { gsap, useGSAP } from '@/libs/vendor'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

import { AnimatedButton } from '@/components/animations/AnimatedButton'
import { AnimatedLink } from '@/components/animations/AnimatedLink'

import { usePageEnterContext } from '@/providers/PageEnterProvider'
import { useModal } from '@/providers/ModalProvider'
import { getLenis } from '@/providers/LenisProvider'
import { usePreloader } from '@/providers/PreloaderProvider'

import { useAsciiDelay } from '@/hooks/useAsciiDelay'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { usePageEnter } from '@/hooks/usePageEnter'
import { usePageTransition } from '@/hooks/usePageTransition'
import { easings } from '@/libs/constants/easings'
import useDualLayerScramble from '@/hooks/useDualLayerScramble'
import { SanityLink } from '@/components/sanity/SanityLink'
import { SanityImage } from '@/components/sanity/SanityImage'
import { HeaderLogo } from '@/components/ui/HeaderLogo'


// NOTE: org-module id: 859745
// import '@/styles/side-effect-859745'
// NOTE: org-module id: 426947
// import '@/styles/side-effect-426947'
// import '@/styles/side-effect-932148'

let easingBackInOut = easings.backInOut
let easingPower3InOut = easings.power3InOut

function FlyoutMenu({
  navItems,
  flyout,
  onClose,
  isOpen,
  spotsRemaining
}) {
  let isLg = useBreakpoint("lg")
  let indicatorSize = isLg ? 32 : 20
  let indicatorOffset = isLg ? 64 : 36
  let containerRef = useRef(null)
  let tlRef = useRef(null)
  let navRef = useRef(null)
  let navItemsRef = useRef([])
  let sanityLinksRef = useRef([])
  let contactLinksRef = useRef([])
  let availabilityDotRef = useRef(null)
  let spotsDotRef = useRef(null)
  let rightSectionRef = useRef(null)
  let pathname = usePathname()
  let router = useRouter()
  let { startTransition, isTransitioning } = usePageTransition()
  
  let [hoveredIndex, setHoveredIndex] = useState(null)
  let [indicatorPos, setIndicatorPos] = useState(null)
  let [hoverCount, setHoverCount] = useState(0)
  let lastHoveredIndex = useRef(null)
  let [isMounted, setIsMounted] = useState(false)

  let activeIndex = useMemo(() => {
    if (!navItems) return null
    let idx = navItems.findIndex(item => !!item.link?.href && (pathname === item.link.href || pathname.startsWith(`${item.link.href}/`)))
    return idx >= 0 ? idx : null
  }, [navItems, pathname])

  let currentIndex = hoveredIndex ?? (isMounted ? activeIndex : null)

  useEffect(() => {
    if (null === currentIndex) {
      setIndicatorPos(null)
      return
    }
    let rafId = requestAnimationFrame(() => {
      let activeItem = navItemsRef.current[currentIndex]
      let navElement = navRef.current
      if (activeItem && navElement) {
        let navRect = navElement.getBoundingClientRect()
        let itemRect = activeItem.getBoundingClientRect()
        setIndicatorPos({
          y: itemRect.top - navRect.top + (itemRect.height - indicatorSize) / 2
        })
      }
    })
    return () => cancelAnimationFrame(rafId)
  }, [currentIndex, indicatorSize])

  let captionScramble = useDualLayerScramble({ duration: .5 })
  let projectScramble = useDualLayerScramble({ duration: .5 })
  let availScramble = useDualLayerScramble({ duration: .5 })
  let spotsScramble = useDualLayerScramble({ duration: .5 })

  useEffect(() => {
    if (!isOpen) {
      setHoveredIndex(null)
      setIndicatorPos(null)
      setHoverCount(0)
      setIsMounted(false)
      lastHoveredIndex.current = null
      captionScramble.kill()
      projectScramble.kill()
      availScramble.kill()
      spotsScramble.kill()
    }
  }, [isOpen, captionScramble, projectScramble, availScramble, spotsScramble])

  let handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  let contact = flyout?.contact
  let team = flyout?.team
  let socials = flyout?.socials
  let location = flyout?.location
  let availability = flyout?.availability
  let centerImage = flyout?.centerImage
  let featuredProject = flyout?.featuredProject

  let { contextSafe } = useGSAP(() => {
    if (containerRef.current) {
      if (tlRef.current?.kill(), isOpen) {
        tlRef.current = gsap.timeline()
        gsap.set(containerRef.current, {
          clipPath: "none",
          gridTemplateRows: "0fr"
        })
        tlRef.current.to(containerRef.current, {
          gridTemplateRows: "1fr",
          duration: 1,
          ease: "expo.inOut"
        })
        
        let validLinks = sanityLinksRef.current.filter(Boolean)
        if (validLinks.length > 0) {
          tlRef.current.fromTo(validLinks, {
            yPercent: 110
          }, {
            yPercent: 0,
            duration: 1.4,
            ease: "expo.out",
            stagger: .1,
            force3D: true
          }, "<+50%")
        }
        
        let validContacts = contactLinksRef.current.filter(Boolean)
        if (validContacts.length > 0) {
          tlRef.current.fromTo(validContacts, {
            yPercent: 110
          }, {
            yPercent: 0,
            duration: .5,
            ease: "power2.out",
            stagger: .04,
            force3D: true
          }, "<+25%")
        }
        
        if (rightSectionRef.current) {
          tlRef.current.fromTo(rightSectionRef.current, {
            opacity: 0
          }, {
            opacity: 1,
            duration: 1,
            ease: "power1.out"
          }, "<+25%")
        }
        
        tlRef.current.add(() => {
          captionScramble.kill()
          projectScramble.kill()
          availScramble.kill()
          spotsScramble.kill()
          captionScramble.scramble()
          projectScramble.scramble()
          availScramble.scramble()
          spotsScramble.scramble()
        }, "<")
        
        if (availabilityDotRef.current) {
          tlRef.current.to(availabilityDotRef.current, {
            opacity: 1,
            duration: .5,
            ease: "power2.out",
            onComplete: () => {
              availabilityDotRef.current?.classList.add("animate-pulse")
            }
          }, "<")
        }
        
        if (spotsDotRef.current) {
          tlRef.current.to(spotsDotRef.current, {
            opacity: 1,
            duration: .5,
            ease: "power2.out",
            onComplete: () => {
              spotsDotRef.current?.classList.add("animate-pulse")
            }
          }, "<")
        }
        
        tlRef.current.add(() => {
          setIsMounted(true)
        }, "<+50%")
      } else {
        tlRef.current = gsap.timeline()
        gsap.set(containerRef.current, {
          clipPath: "inset(0% 0% 0% 0%)"
        })
        tlRef.current.to(containerRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: .6,
          ease: "expo.inOut",
          onComplete: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                gridTemplateRows: "0fr",
                clipPath: "none"
              })
            }
            if (availabilityDotRef.current) {
              gsap.set(availabilityDotRef.current, {
                opacity: 0
              })
              availabilityDotRef.current.classList.remove("animate-pulse")
            }
            if (spotsDotRef.current) {
              gsap.set(spotsDotRef.current, {
                opacity: 0
              })
              spotsDotRef.current.classList.remove("animate-pulse")
            }
            if (rightSectionRef.current) {
              gsap.set(rightSectionRef.current, {
                opacity: 0
              })
            }
          }
        })
      }
    }
  }, {
    dependencies: [isOpen],
    scope: containerRef
  })

  let handleCaptionEnter = contextSafe(() => {
    captionScramble.scramble()
  })

  let handleProjectEnter = contextSafe(() => {
    projectScramble.scramble()
  })

  let handleLinkClick = useCallback((e, t) => {
    e.preventDefault()
    if (!isTransitioning) {
      onClose()
      setTimeout(() => {
        startTransition(() => {
          router.push(t, {
            scroll: true
          })
        })
      }, 150)
    }
  }, [onClose, router, startTransition, isTransitioning])

  return (
    <div className="grid-container">
      <div
        ref={containerRef}
        className="grid bg-surface transition-colors duration-300"
        style={{ gridTemplateRows: "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="p-24 lg:p-64">
            <div className="grid-layout gap-y-32">
              <nav ref={navRef} className="grid-span-12 lg:grid-span-4 relative flex flex-col items-start gap-4">
                {indicatorPos && (
                  <motion.div
                    className="pointer-events-none absolute left-0 bg-brand"
                    style={{
                      width: indicatorSize,
                      height: indicatorSize
                    }}
                    initial={{
                      x: -indicatorOffset,
                      y: indicatorPos.y,
                      opacity: 0
                    }}
                    animate={{
                      x: 0,
                      y: indicatorPos.y,
                      rotate: 90 * hoverCount,
                      opacity: 1
                    }}
                    transition={{
                      x: { duration: .6, ease: easingPower3InOut },
                      y: { duration: .6, ease: easingBackInOut },
                      rotate: { duration: .6, ease: easingBackInOut },
                      opacity: { duration: .15 }
                    }}
                  />
                )}
                {navItems?.map((item, index) => {
                  if (!item.link) return null
                  let isActive = index === activeIndex
                  let isHovered = index === hoveredIndex
                  let isCurrent = index === currentIndex
                  return (
                    <div
                      key={item._key}
                      ref={el => { navItemsRef.current[index] = el }}
                      className="overflow-y-clip overflow-x-visible"
                    >
                      <motion.div
                        animate={{
                          x: isCurrent ? indicatorOffset : 0
                        }}
                        transition={{
                          duration: .6,
                          ease: easingPower3InOut
                        }}
                        onMouseEnter={() => {
                          if (null !== lastHoveredIndex.current && lastHoveredIndex.current !== index) {
                            setHoverCount(prev => prev + 1)
                          }
                          lastHoveredIndex.current = index
                          setHoveredIndex(index)
                        }}
                        onMouseLeave={handleMouseLeave}
                      >
                        <SanityLink
                          ref={el => { sanityLinksRef.current[index] = el }}
                          link={item.link}
                          onClick={e => handleLinkClick(e, item.link?.href ?? "/")}
                          className={cx(
                            "block py-4 text-h2 transition-colors duration-300",
                            isActive || isHovered ? "text-brand" : ""
                          )}
                        >
                          {item.text}
                        </SanityLink>
                      </motion.div>
                    </div>
                  )
                })}
              </nav>

              <div className="grid-span-12 lg:grid-span-2 lg:grid-start-5 flex flex-col gap-24">
                {(contact?.email || contact?.phone) && (
                  <div className="flex flex-col gap-4">
                    <div className="overflow-hidden">
                      <p
                        ref={el => { contactLinksRef.current[0] = el }}
                        className="text-accent text-foreground-muted transition-colors duration-300"
                      >
                        Contact
                      </p>
                    </div>
                    {contact.email && (
                      <div className="overflow-hidden">
                        <AnimatedLink
                          ref={el => { contactLinksRef.current[1] = el }}
                          href={`mailto:${contact.email}`}
                          className="block text-body-sm transition-colors duration-300 lg:text-body"
                        >
                          {contact.email}
                        </AnimatedLink>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="overflow-hidden">
                        <AnimatedLink
                          ref={el => { contactLinksRef.current[2] = el }}
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="block text-body-sm transition-colors duration-300 lg:text-body"
                        >
                          {contact.phone}
                        </AnimatedLink>
                      </div>
                    )}
                  </div>
                )}
                
                {team && team.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {team.map((member, index) => (
                      <div key={member._key} className="overflow-hidden">
                        <AnimatedLink
                          ref={el => { contactLinksRef.current[3 + index] = el }}
                          href={`mailto:${member.email}`}
                          className="block text-body-sm transition-colors duration-300 lg:text-body"
                        >
                          {member.name}: {member.email}
                        </AnimatedLink>
                      </div>
                    ))}
                  </div>
                )}

                {socials && socials.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {socials.map((social, index) => (
                      <div key={social._key} className="overflow-hidden">
                        <AnimatedLink
                          ref={el => { contactLinksRef.current[3 + (team?.length ?? 0) + index] = el }}
                          href={social.href ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-body-sm transition-colors duration-300 lg:text-body"
                        >
                          {social.name}: {social.handle}
                        </AnimatedLink>
                      </div>
                    ))}
                  </div>
                )}

                {location && (
                  <div className="overflow-hidden">
                    <p
                      ref={el => { contactLinksRef.current[3 + (team?.length ?? 0) + (socials?.length ?? 0)] = el }}
                      className="text-accent-sm text-foreground-muted transition-colors duration-300"
                    >
                      {location}
                    </p>
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-8">
                  {availability?.text && (
                    <p className="inline-flex items-start gap-8 text-accent-sm transition-colors duration-300">
                      {availability.isAvailable && (
                        <span ref={availabilityDotRef} className="mt-6 inline-block size-8 shrink-0 bg-brand opacity-0" />
                      )}
                      <span ref={availScramble.ref} className="opacity-0">
                        {availability.text}
                      </span>
                    </p>
                  )}
                  {spotsRemaining && spotsRemaining > 0 ? (
                    <p className="inline-flex items-start gap-8 text-accent-sm transition-colors duration-300">
                      <span ref={spotsDotRef} className="mt-6 inline-block size-8 shrink-0 bg-brand opacity-0" />
                      <span ref={spotsScramble.ref} className="opacity-0">
                        {`Only ${spotsRemaining} spot${1 === spotsRemaining ? "" : "s"} left`}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div ref={rightSectionRef} className="grid-span-5 grid-start-8 hidden gap-16 opacity-0 lg:flex">
                <div className="flex flex-1 flex-col gap-8">
                  {centerImage?.image ? (
                    centerImage.link ? (
                      <SanityLink
                        link={centerImage.link}
                        onClick={e => handleLinkClick(e, centerImage.link?.href ?? "/")}
                        onMouseEnter={handleCaptionEnter}
                        className="block flex-1 overflow-hidden"
                      >
                        <SanityImage
                          image={centerImage.image}
                          className="zoom-in-image h-full w-full object-cover"
                          alt={centerImage.image.altText ?? ""}
                        />
                      </SanityLink>
                    ) : (
                      <SanityImage
                        image={centerImage.image}
                        className="zoom-in-image h-full w-full object-cover"
                        alt={centerImage.image.altText ?? ""}
                      />
                    )
                  ) : (
                    <div className="h-full w-full bg-foreground/5" />
                  )}
                  {centerImage?.caption && (
                    <p ref={captionScramble.ref} className="text-accent-sm transition-colors duration-300">
                      {centerImage.caption}
                    </p>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-8">
                  {featuredProject?.project?.uri && featuredProject.project.image ? (
                    <Link
                      href={featuredProject.project.uri}
                      onClick={e => handleLinkClick(e, featuredProject.project?.uri ?? "/")}
                      onMouseEnter={handleProjectEnter}
                      className="block flex-1 overflow-hidden transition-opacity duration-300 hover:opacity-80"
                    >
                      <SanityImage
                        image={featuredProject.project.image}
                        className="zoom-in-image h-full w-full object-cover"
                        alt={featuredProject.project.title ?? "Featured Project"}
                      />
                    </Link>
                  ) : (
                    <div className="h-full w-full bg-foreground/5" />
                  )}
                  {featuredProject?.caption && (
                    <p ref={projectScramble.ref} className="text-accent-sm transition-colors duration-300">
                      {featuredProject.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuButton({ isOpen, onClick, className }) {
  let translateYOpen = isOpen ? "calc(-1em - 2px)" : "0px"
  let transformTopLine = isOpen ? "rotate(45deg) translateY(0px)" : "rotate(0deg) translateY(-3px)"
  let transformBottomLine = isOpen ? "rotate(-45deg) translateY(0px)" : "rotate(0deg) translateY(3px)"
  let ariaLabel = isOpen ? "Close" : "Menu"
  let mergedClassName = cx(
    "group flex cursor-pointer items-center gap-8 transition-colors transition-opacity duration-300 hover:opacity-70",
    "text-accent uppercase tracking-tight",
    className
  )

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      className={mergedClassName}
    >
      <span className="relative h-[1em] w-[3.5em] overflow-hidden">
        <span
          className="flex flex-col gap-2 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${translateYOpen})` }}
        >
          <span className="block h-[1em] leading-none">Menu</span>
          <span className="block h-[1em] leading-none">Close</span>
        </span>
      </span>
      <span className="relative flex h-16 w-16 flex-col items-center justify-center">
        <span
          className="absolute h-[2px] w-full origin-center bg-current"
          style={{
            transform: transformTopLine,
            transition: "transform 250ms ease-out"
          }}
        />
        <span
          className="absolute h-[2px] w-full origin-center bg-current"
          style={{
            transform: transformBottomLine,
            transition: "transform 250ms ease-out"
          }}
        />
      </span>
    </button>
  )
}

let THEME_SELECTOR = "main [data-page-builder-section][data-theme]"
let STATE_PADDING_MAP = {
  top: 0,
  scrolled: 16,
  menuOpen: 64
}

export function HeaderClient({ navItems, headerCta, flyout, spotsRemaining }) {
  let headerRef = useRef(null)
  let wrapperRef = useRef(null)

  let {
    isMenuOpen,
    headerState,
    headerTheme,
    toggleMenu,
    closeMenu
  } = (function(ref) {
    let [scrollState, setScrollState] = useState("top")
    let [isMenuOpen, setIsMenuOpen] = useState(false)
    let [headerTheme, setHeaderTheme] = useState("dark")
    usePathname()

    let { phase: transitionPhase } = usePageTransition()

    let updateTheme = useCallback(offsetTop => {
      let elements = document.querySelectorAll(THEME_SELECTOR)
      if (elements.length === 0) return false
      
      let targetElement = Array.from(elements).find(el => {
        let rect = el.getBoundingClientRect()
        return rect.top <= offsetTop && rect.bottom > offsetTop
      })
      
      if (targetElement) {
        let theme = targetElement.dataset.theme
        if (theme && ["light", "dark", "brand"].includes(theme)) {
          setHeaderTheme(theme)
          return true
        }
      }
      
      let firstElement = elements[0]
      let firstTheme = firstElement?.dataset.theme
      if (firstTheme && ["light", "dark", "brand"].includes(firstTheme)) {
        setHeaderTheme(firstTheme)
        return true
      }
      return false
    }, [])

    ;(function(eventName, handler, element = window, options) {
      let savedHandler = useRef(handler)
      useEffect(() => {
        savedHandler.current = handler
      }, [handler])
      useEffect(() => {
        if (!element) return
        let eventListener = e => {
          savedHandler.current(e)
        }
        element.addEventListener(eventName, eventListener, options)
        return () => {
          element.removeEventListener(eventName, eventListener, options)
        }
      }, [eventName, element, options])
    })("scroll", () => {
      setScrollState(window.scrollY > 50 ? "scrolled" : "top")
      if (ref.current) {
        updateTheme(ref.current.offsetTop)
      }
    }, window, { passive: true })

    useEffect(() => {
      if (ref.current && ("exiting" === transitionPhase || "idle" === transitionPhase)) {
        updateTheme(ref.current.offsetTop)
      }
    }, [transitionPhase, updateTheme, ref.current])

    useEffect(() => {
      if (!ref.current) return
      let offsetTop = ref.current.offsetTop
      if (document.querySelectorAll(THEME_SELECTOR).length > 0) {
        updateTheme(offsetTop)
        return
      }
      let observer = new MutationObserver(() => {
        if (document.querySelectorAll(THEME_SELECTOR).length > 0) {
          updateTheme(offsetTop)
          observer.disconnect()
        }
      })
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-theme"]
      })
      return () => observer.disconnect()
    }, [updateTheme, ref.current])

    let computedHeaderState = useMemo(() => isMenuOpen ? "menuOpen" : scrollState, [isMenuOpen, scrollState])
    
    let handleToggleMenu = useCallback(() => {
      setIsMenuOpen(prev => !prev)
    }, [])
    
    let handleCloseMenu = useCallback(() => {
      setIsMenuOpen(false)
    }, [])

    ;(function(key, handler, useCapture = false) {
      let eventListener = useCallback(e => {
        if (e.key === key) handler(e)
      }, [key, handler])
      useEffect(() => {
        window.addEventListener("keydown", eventListener, useCapture)
        return () => {
          window.removeEventListener("keydown", eventListener, useCapture)
        }
      }, [eventListener, useCapture])
    })("Escape", () => {
      if (isMenuOpen) handleCloseMenu()
    })

    let isLenisStopped = useRef(false)
    useEffect(() => {
      if (isMenuOpen) {
        getLenis()?.stop()
        isLenisStopped.current = true
      } else if (isLenisStopped.current) {
        getLenis()?.start()
        isLenisStopped.current = false
      }
    }, [isMenuOpen])

    return {
      scrollState,
      isMenuOpen,
      headerState: computedHeaderState,
      headerTheme,
      sectionTheme: headerTheme,
      toggleMenu: handleToggleMenu,
      closeMenu: handleCloseMenu
    }
  })(wrapperRef)

  let { openModal } = useModal()
  let { prefersReducedMotion } = usePageEnterContext()
  let { isInitialLoad } = usePreloader()
  let isLgScreen = useBreakpoint("lg")
  let asciiDelay = useAsciiDelay()

  useLayoutEffect(() => {
    if (isInitialLoad && !prefersReducedMotion && headerRef.current) {
      headerRef.current.classList.add("header-hidden", "no-transition")
      requestAnimationFrame(() => {
        headerRef.current?.classList.remove("no-transition")
      })
    }
  }, [isInitialLoad, prefersReducedMotion])

  let dynamicPadding = STATE_PADDING_MAP[headerState]
  let currentPadding = isLgScreen ? dynamicPadding : ("top" === headerState ? 0 : ("scrolled" === headerState ? 16 : 24))
  let { phase: currentPhase } = usePageTransition()

  useEffect(() => {
    if (!prefersReducedMotion && headerRef.current) {
      if ("entering" === currentPhase) {
        headerRef.current.classList.add("header-hidden")
      } else if ("holding" === currentPhase) {
        headerRef.current.classList.add("header-hidden", "no-transition")
        requestAnimationFrame(() => {
          headerRef.current?.classList.remove("no-transition")
        })
      }
    }
  }, [currentPhase, prefersReducedMotion])

  let enterCallback = delay => {
    if (headerRef.current) {
      setTimeout(() => {
        headerRef.current?.classList.remove("header-hidden")
      }, (delay + (isInitialLoad ? asciiDelay : 0)) * 1000)
    }
  }

  usePageEnter(enterCallback, { priority: 0, skip: prefersReducedMotion })

  let isHeaderHidden = useRef(false)

  useEffect(() => {
    if ("entering" === currentPhase || "holding" === currentPhase) {
      isHeaderHidden.current = false
    }
  }, [currentPhase])

  useLenis(() => {
    if (prefersReducedMotion || !headerRef.current) return
    let threshold = .1 * window.innerHeight
    let shouldHide = false
    let footer = document.querySelector("footer")
    
    if (footer) {
      let footerRect = footer.getBoundingClientRect()
      if (footerRect.height > 0 && footerRect.top <= threshold) {
        shouldHide = true
      }
    }
    
    if (!shouldHide) {
      for (let section of document.querySelectorAll("[data-hide-header]")) {
        if (section.getBoundingClientRect().top <= threshold) {
          shouldHide = true
          break
        }
      }
    }
    
    if (shouldHide !== isHeaderHidden.current) {
      isHeaderHidden.current = shouldHide
      headerRef.current.classList.toggle("header-hidden", shouldHide)
    }
  })

  let overlayClassName = cx(
    "fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm",
    "transition-opacity duration-500 ease-out",
    isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
  )

  let headerClassName = cx(
    "fixed inset-x-0 top-0 z-[9999]",
    "flex flex-col gap-8 pt-16",
    "!bg-transparent transition-colors duration-300 ease-out"
  )

  let wrapperClassName = cx(
    "grid-container transition-[padding,background-color,color] duration-500 ease-out",
    "top" === headerState ? "bg-transparent" : "bg-surface"
  )

  return (
    <Fragment>
      <div onClick={closeMenu} className={overlayClassName} aria-hidden="true" />
      <header ref={headerRef} data-theme={headerTheme} className={headerClassName}>
        <div ref={wrapperRef} className={wrapperClassName} style={{ paddingLeft: currentPadding, paddingRight: currentPadding }}>
          <div className="py-16">
            <div className="grid grid-cols-2 items-center lg:grid-cols-3">
              <div className="justify-self-start">
                <HeaderLogo isMenuOpen={isMenuOpen} />
              </div>
              <div className="justify-self-end lg:justify-self-center">
                <MenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
              </div>
              {headerCta?.text ? (
                <AnimatedButton
                  size="sm"
                  theme="brand"
                  className="hidden justify-self-end lg:inline-flex"
                  onClick={() => openModal("cal-booking")}
                >
                  {headerCta.text}
                </AnimatedButton>
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </div>
        </div>
        <FlyoutMenu
          navItems={navItems}
          flyout={flyout}
          onClose={closeMenu}
          isOpen={isMenuOpen}
          spotsRemaining={spotsRemaining}
        />
      </header>
    </Fragment>
  )
}
