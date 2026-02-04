import { useEffect, useRef, useState } from "react"

export function useHeaderVisivility(minScroll: number = 50) {
  const lastScroll = useRef(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    let rafId: number | null = null
    let latestY = window.scrollY

    const update = () => {
      const current = latestY

      if (current > lastScroll.current) {
        if (current >= minScroll) setShow(false)
      } else {
        setShow(true)
      }
      lastScroll.current = current
      rafId = null
    }

    const onScroll = () => {
      latestY = window.scrollY
      rafId ??= requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [minScroll])

  return { show }
}
