"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const title = (formData.get("title") as string).trim()
  const content = (formData.get("content") as string).trim()

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, user_id: user.id })
    .select("id")
    .single()

  if (error || !data) redirect("/posts/new?error=글 저장에 실패했습니다")

  revalidatePath("/", "layout")
  redirect(`/posts/${data.id}`)
}
