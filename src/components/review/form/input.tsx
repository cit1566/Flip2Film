import { forwardRef } from "react"
import styles from "./input.module.css"
import Label from "./label"

type InputProps = {
  labelText: string
  id: string
  mandatory?: boolean
  secondInput?: boolean
  currentLength?: number
  maxLength?: number
  error?: string | undefined
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      labelText,
      id,
      mandatory = false,
      secondInput = false,
      error,
      currentLength,
      maxLength,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <Label
          labelText={labelText}
          id={id}
          mandatory={mandatory}
          secondInput={secondInput}
        />
        <input
          ref={ref}
          id={id}
          className={styles.inputBox}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <div className={styles.subMessagesWrapper}>
          {error && (
            <p id={`${id}-error`} className={styles.error} role="alert">
              {error}
            </p>
          )}
          {typeof currentLength === "number" &&
            typeof maxLength === "number" && (
              <p className={styles.letterLimit}>
                {currentLength} / {maxLength}
              </p>
            )}
        </div>
      </>
    )
  }
)

Input.displayName = "Input"

export default Input
