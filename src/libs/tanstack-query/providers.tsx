"use client"

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import type * as React from "react"
import { useState } from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 30,
            gcTime: 1000 * 60 * 60 * 24,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  const persister = createAsyncStoragePersister({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    key: "REACT_QUERY_OFFLINE_CACHE", // 옵션(원하면 변경)
    throttleTime: 1000, // 옵션(기본값 1000ms)
  })

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: query => query.options.meta?.persist === true,
        },
      }}
    >
      {/* <AuthBootstrap /> */}
      {children}
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  )
}
