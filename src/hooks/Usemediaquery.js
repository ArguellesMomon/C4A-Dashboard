import { useEffect, useState } from 'react'

// Tracks whether a media query currently matches, and re-renders if it
// changes (e.g. resizing the window, or rotating a tablet). Used to turn
// certain mobile-only UI (like the day-events popup) off once the layout
// has room to show the same information inline instead.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    function handleChange(event) {
      setMatches(event.matches)
    }
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}