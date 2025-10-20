import { useEffect } from 'react'

/**
 * Custom hook to manage header visibility based on scroll position
 * Hides header-top when user scrolls down, shows when at top
 * @param {Function} setShowHeaderTop - State setter for header visibility
 */
export function useHeaderScroll(setShowHeaderTop) {
  useEffect(() => {
    const handleScroll = () => {
      // Hide header-top when scrollY > 0, show only when at top (scrollY === 0)
      if (window.scrollY > 0) {
        setShowHeaderTop(false)
      } else {
        setShowHeaderTop(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setShowHeaderTop])
}
