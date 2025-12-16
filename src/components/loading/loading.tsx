import { LoaderCircle } from "lucide-react"

export default function LoadingPage() {
  return (
    <div>
      <LoaderCircle width={30} height={30} />
      <p>잠시만 기다려 주세요.</p>
    </div>
  )
}
