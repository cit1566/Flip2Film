import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  // 렌더마다 새로 만들면 캐시가 날아가니  useState로 1회 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 30,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
