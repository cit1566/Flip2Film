export function extractImageSrcList(html: string): string[] {
  const regex = /<img[^>]*src=["']([^"']+)["'][^>]*>/g
  const result: string[] = []
  let match

  while ((match = regex.exec(html)) !== null) {
    if (match[1]) {
      result.push(match[1])
    }
  }
  return result
}
