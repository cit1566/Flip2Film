import { forwardRef } from "react"
import styles from "./input.module.css"
import Label from "./label"

type TextareaProps = {
  labelText: string
  id: string
  mandatory?: boolean
  secondInput?: boolean
  error?: string | undefined
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { labelText, id, mandatory = false, secondInput = false, error, ...props },
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
        <textarea ref={ref} id={id} className={styles.inputBox} {...props} />
        {error && <p className={styles.error}>{error}</p>}
      </>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
