// 유틸리티 함수: 배열을 N개씩 묶기
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export default chunkArray
