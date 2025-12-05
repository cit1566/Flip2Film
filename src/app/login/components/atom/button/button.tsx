"use client"

import type { ButtonHTMLAttributes } from "react"
import styles from "./button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export default function Button({ label, ...props }: ButtonProps) {
  return (
    <button className={styles.button} {...props}>
      {label}
    </button>
  )
}
