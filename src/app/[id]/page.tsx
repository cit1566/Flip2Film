import MainBody from "../../components/main-body/main-body"

interface PageProps {
  params: { id: "book" | "movie" }
}

export default async function PostPage({ params }: PageProps) {
  const LinkParams = await params
  return <MainBody category={LinkParams.id}></MainBody>
}
