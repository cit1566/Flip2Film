import { useEffect, useState } from "react"

/**
 * 간단 디바운스 훅 (async validate 호출 과다 방지)
 */
export default function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])
  return debounced
}
