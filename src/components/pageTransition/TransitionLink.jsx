'use client'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTransition } from '@/hooks/usePageTransition'

function TransitionLink(props) {
  const { href, as, replace, scroll, onClick, ...rest } = props
  
  const router = useRouter()
  const { startTransition, isTransitioning } = usePageTransition()

  const handleClick = (event) => {
    if (onClick) {
      onClick(event)
    }

    if (
      event.defaultPrevented ||
      isTransitioning ||
      (function(t) {
        let targetAttr
        const { nodeName } = t.currentTarget
        return (
          nodeName.toUpperCase() === 'A' &&
          ((!!(targetAttr = t.currentTarget.getAttribute('target')) && targetAttr !== '_self') ||
            !!t.metaKey ||
            !!t.ctrlKey ||
            !!t.shiftKey ||
            !!t.altKey ||
            (!!t.nativeEvent && t.nativeEvent.which === 2))
        ) || false
      })(event)
    ) {
      return
    }

    event.preventDefault()

    const targetUrl = as || href
    const urlString = typeof targetUrl === 'string' ? targetUrl : targetUrl.toString()

    const handleNavigation = () => {
      if (replace) {
        router.replace(urlString, { scroll: scroll ?? true })
      } else {
        router.push(urlString, { scroll: scroll ?? true })
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleNavigation()
    } else {
      startTransition(() => {
        handleNavigation()
      })
    }
  }

  return (
    <NextLink
      {...rest}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      onClick={handleClick}
    />
  )
}

export function Link(props) {
  return <TransitionLink {...props} />
}
