export default async function measureTime(
  label: string,
  fn: () => Promise<void>
) {
  const start = Date.now()
  await fn()
  const end = Date.now()
  console.log(`${label} : ${end - start}ms`)
}
