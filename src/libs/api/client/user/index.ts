/**
 * Barrel exports for user APIs
 * 사용처에서는 이 파일만 import 하도록 통로 역할
 * 예) import { logIn, getUser, uploadProfileImage } from "@/libs/api/user"
 */

// Auth / OAuth / Password
export {
  default as createUser,
  logIn,
  logOut,
  resetPasswordEmail,
  signInWithSocial,
  updatePassword,
} from "./auth"

// Session
export { getBrowserSession, getBrowserUser } from "./session"

// public.user (DB)
export { getUser, updateUser } from "./profile"

// Storage (Profile image)
export {
  assert,
  getProfileImageUrl,
  makeProfileImagePath,
  makeUuid,
  uploadProfileImage,
  validateProfileImage,
} from "./profile-image"
