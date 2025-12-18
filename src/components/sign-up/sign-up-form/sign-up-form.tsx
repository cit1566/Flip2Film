"use client"

import Button from "@/components/atom/button/button"
import Input from "@/components/atom/input/input"
import ProfileUpload from "@/components/atom/profile-upload/profile-upload"
import TermsText from "@/components/sign-up/terms-text/terms-text"
import { useEffect, useState } from "react"
import createUser from "../../../libs/api/user/user-api"

export default function SignUpForm() {
  const [_profileImage, setProfileImage] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [nickname, setNickname] = useState("")
  const [bio, setBio] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    const handleFunction = async () => {
      const userInfo = {
        email: "cit1566@naver.com",
        password: "qwer1234!",
        bio: "안녕하세요",
        nickname: "말랑콩떡",
        profile_image: "",
      }
      const userData = await createUser(userInfo)
      console.log(userData)
    }

    handleFunction()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <ProfileUpload onChange={setProfileImage} />

      <Input
        label="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        clearable
        value={email}
        onChange={e => setEmail(e.target.value)}
        status={
          email.length === 0
            ? "default"
            : email.includes("@") && email.includes(".")
              ? "success"
              : "error"
        }
      />

      <Input
        label="비밀번호"
        type="password"
        placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
        togglePassword
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <Input
        label="비밀번호 재입력"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        togglePassword
        value={passwordCheck}
        onChange={e => setPasswordCheck(e.target.value)}
        status={
          passwordCheck.length === 0
            ? "default"
            : password === passwordCheck
              ? "success"
              : "error"
        }
      />

      <Input
        label="닉네임"
        type="text"
        placeholder="최소 2자, 최대 6자"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
      />

      <Input
        label="Bio"
        type="text"
        placeholder="자기소개를 입력해주세요"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />

      <TermsText />

      <Button variant="green" title="가입하기" type="submit" />
    </form>
  )
}
