import { usePageTransitionContext } from '@/providers/PageTransitionProvider'

export function usePageTransition() {
  const {
    startTransition,
    phase,
    isPending
  } = usePageTransitionContext()

  const isTransitioning = phase !== 'idle'

  return {
    startTransition,
    isTransitioning,
    phase,
    isPending
  }
}