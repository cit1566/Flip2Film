"use client"
import { getQueryClient } from "@/app/get-query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type * as React from "react"
import AuthBootstrap from "../components/auth/AuthBootstrap"

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
