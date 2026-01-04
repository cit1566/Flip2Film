import createClient from "../supabase/client"

export default async function uploadImage(
  saveType: "draft" | "public",
  userId: string,
  file: File
): Promise<string> {
  const supabase = createClient()

  const ext = file.name.split(".").pop() ?? "png"
  const path = `${saveType}/${userId}.${ext}`

  const { error } = await supabase.storage
    .from("post_images")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from("post_images").getPublicUrl(path)

  return data.publicUrl
}
