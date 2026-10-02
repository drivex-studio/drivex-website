'use client'

import { useEffect } from 'react'

export default function TabTitleMessage() {
  useEffect(() => {
    let originalTitle = document.title

    function handleVisibilityChange() {
      if (document.hidden) {
        originalTitle = document.title
        document.title = "Don't be shy, Fella. 🟩"
      } else {
        document.title = originalTitle
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [])

  return null
}
