import type { PropsWithChildren } from "react"
import styles from "./button.module.css"

interface ButtonProps extends PropsWithChildren {
  variant: "base" | "green" | "warning"
  disabled?: boolean
  title: string
  className?: string | undefined
  type?: "button" | "submit" | "reset"
}

export default function Button({
  variant,
  disabled = false,
  title,
  className,
  type = "button",
  children,
}: ButtonProps) {
  const variantClass = {
    base: styles.buttonTypeBase,
    green: styles.buttonTypeGreen,
    warning: styles.buttonTypeWarning,
  }[variant]

  return (
    <button
      type={type ?? "button"}
      className={`${styles.buttonBase} ${variantClass} ${className}`}
      disabled={disabled}
    >
      {title}
      {children}
    </button>
  )
}
