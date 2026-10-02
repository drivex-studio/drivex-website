'use client'

import '@/libs/analytics/linkedinTracking'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense, Fragment } from 'react'
import { captureEvent, setupIdleInit } from '@/libs/analytics/posthog-client'

export function PostHogProvider({ children }) {
  useEffect(setupIdleInit, [])
  return <Fragment>{children}</Fragment>
}

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    let currentUrl = window.origin + pathname
    if (searchParams.toString()) {
      currentUrl = `${currentUrl}?${searchParams.toString()}`
    }
    captureEvent('$pageview', { $current_url: currentUrl })
  }, [pathname, searchParams])

  return null
}

export function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  )
}
