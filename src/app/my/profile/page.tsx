import MyProfileForm from "@/components/my-profile/my-profile-form/my-profile-form"

export default function MyProfilePage() {
  return (
    <section aria-labelledby="my-profile-title">
      <h1 id="my-profile-title" className="sr-only">
        프로필 수정
      </h1>
      <MyProfileForm />
    </section>
  )
}
