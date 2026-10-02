'use client'
import dynamic from 'next/dynamic'
const PageTransitionRectangles = dynamic(
  () => import('@/components/pageTransition/PageTransitionRectangles').then((mod) => mod.PageTransitionRectangles),
  { ssr: false }
)

export function LazyPageTransitionRectangles() {
  return <PageTransitionRectangles />
}