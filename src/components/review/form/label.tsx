import styles from "./label.module.css"

interface LabelProps {
  labelText: string
  id: string
  mandatory?: boolean
  secondInput?: boolean
}

export default function Label({
  labelText,
  id,
  mandatory = false,
  secondInput,
}: LabelProps) {
  return (
    <label
      htmlFor={id}
      className={`${styles.heading} ${secondInput && styles.secondInput}`}
    >
      {labelText}
      {mandatory && <span className={styles.mandatory}>*</span>}
    </label>
  )
}
