export default function removeImageTags(html: string): string {
  return html.replace(/<img[^>]*>/g, "")
}
