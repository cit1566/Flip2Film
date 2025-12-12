import { useCallback, useRef } from "react"

type ArrayFunc = (...args: unknown[]) => void

export function useDebounceCallback<T extends ArrayFunc>(
  callback: T,
  delay: number = 300
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}
