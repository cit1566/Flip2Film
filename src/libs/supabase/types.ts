import type { Tables, TablesInsert, TablesUpdate } from "./database.types"

// 유저 타입
export type User = Tables<"user">
export type UserPartial = Partial<User>
export type UserInsert = TablesInsert<"user">
export type UserUpdate = TablesUpdate<"user">

// 리뷰 타입
export type Review = Tables<"review">
export type ReviewPartial = Partial<Review>
export type ReviewInsert = TablesInsert<"review">
export type ReviewUpdate = TablesUpdate<"review">
