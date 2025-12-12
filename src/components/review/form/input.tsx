import styles from "./input.module.css"
import Label from "./label"

type InputProps = {
  labelText: string
  id: string
  name: string
  type?: string
  mandatory?: boolean
  secondInput?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export default function Input({
  labelText,
  id,
  name,
  type = "text",
  mandatory = false,
  secondInput = false,
  ...props
}: InputProps) {
  return (
    <>
      <Label
        labelText={labelText}
        id={id}
        mandatory={mandatory}
        secondInput={secondInput}
      />
      <input
        id={id}
        name={name}
        type={type}
        className={styles.inputBox}
        {...props}
      />
    </>
  )
}
