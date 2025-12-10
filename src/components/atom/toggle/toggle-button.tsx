import styles from "./toggle-button.module.css"

interface ToggleButtonProps {
  checked: boolean
  id: string
  name: string
  onChange: (value: boolean) => void
}

export default function ToggleButton({
  checked,
  id,
  name,
  onChange,
  ...props
}: ToggleButtonProps) {
  return (
    <button
      className={`${styles.toggleButton} ${checked ? styles.on : styles.off} `}
      type="button"
      id={id}
      name={name}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      {...props}
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}
