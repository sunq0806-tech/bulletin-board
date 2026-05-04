"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const title = (formData.get("title") as string).trim()
  const content = (formData.get("content") as string).trim()

  const { error } = await supabase
    .from("posts")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) redirect(`/posts/${id}/edit?error=수정에 실패했습니다`)

  revalidatePath("/", "layout")
  revalidatePath(`/posts/${id}`)
  redirect(`/posts/${id}`)
}
