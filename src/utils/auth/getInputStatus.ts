/**
 * Input 상태 계산 (UI용)
 */

export default function getInputStatus(
  isTouched: boolean,
  hasError: boolean,
  value: string
) {
  if (hasError) return "error"
  if (isTouched && value.trim().length > 0) return "success"
  return "default"
}
