/**
 * 일정 시간(delay) 후에 성공 또는 실패 결과를 반환하는 Promise를 생성합니다.
 *
 * @example
 * // 2초 후 성공 메시지 반환
 * wait(2).then(console.log) // '요청 결과 성공입니다.'
 *
 * @example
 * // 1.2초 후 실패 메시지 반환
 * wait(1.2, { forceResolved: true }).catch(console.error) // '요청 결과 실패했습니다.'
 *
 * @example
 * // 3초 후 커스텀 성공 메시지 반환
 * wait(3, { resolveMessage: '완료!' }).then(console.log) // '완료!'
 */
export default function wait(
  delay = 1,
  {
    forceResolved,
    resolveMessage = '요청 결과 성공입니다.',
    rejectMessage = '요청 결과 실패했습니다.',
  }: WaitOptions = {}
) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (forceResolved) reject(rejectMessage)
      resolve(resolveMessage)
    }, delay * 1000)
  )
}

interface WaitOptions {
  forceResolved?: boolean
  resolveMessage?: string
  rejectMessage?: string
}
