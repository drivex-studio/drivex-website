'use client'
import dynamic from 'next/dynamic'

const PostHogProvider = dynamic(() => import('@/providers/PostHogProvider').then(e => e.PostHogProvider), {
  ssr: false
})

const PostHogPageView = dynamic(() => import('@/providers/PostHogProvider').then(e => e.PostHogPageView), {
  ssr: false
})

export function LazyAnalytics({ children }) {
  return (
    <PostHogProvider>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  )
}
