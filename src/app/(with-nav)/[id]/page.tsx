import MainBody from "../../../components/main-body/main-body"

interface CategoryPageProps {
  params: { id: "book" | "movie" }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  return <MainBody category={id}></MainBody>
}
