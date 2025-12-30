export default function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject("Error converting file to base64")
    }
    reader.onerror = error => reject(error)
  })
}
