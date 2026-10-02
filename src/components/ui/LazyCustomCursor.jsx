'use client'
import dynamic from 'next/dynamic'

const DynamicCustomCursor = dynamic(
  () => import('@/components/ui/CustomCursor'),
  { ssr: false }
)

export function LazyCustomCursor({ children }) {
  return <DynamicCustomCursor>{children}</DynamicCustomCursor>
}
