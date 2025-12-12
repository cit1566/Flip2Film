"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className: string | undefined
}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={className}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2, // 매우 짧고 눈에 안 거슬림
          ease: "linear",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
