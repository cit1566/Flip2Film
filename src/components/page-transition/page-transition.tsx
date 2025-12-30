"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
