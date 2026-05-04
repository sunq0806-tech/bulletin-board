export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PostForm } from "@/components/post-form"
import { updatePost } from "./actions"

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post || post.user_id !== user?.id) notFound()

  const action = updatePost.bind(null, id)

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">글 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm
            action={action}
            defaultTitle={post.title}
            defaultContent={post.content}
            submitLabel="수정 완료"
            error={error ? decodeURIComponent(error) : undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}
