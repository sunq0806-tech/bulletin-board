export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "@/components/delete-button"
import { deletePost } from "./actions"

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === post.user_id

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <article className="max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-500">
          <Link href="/">← 목록으로</Link>
        </Button>
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">{post.title}</h1>
        <p className="text-slate-400 text-sm">{date}</p>
      </div>

      <div className="prose prose-slate max-w-none mb-8">
        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{post.content}</p>
      </div>

      {isOwner && (
        <div className="flex gap-3 pt-6 border-t border-slate-100">
          <Button asChild variant="outline" size="sm">
            <Link href={`/posts/${post.id}/edit`}>수정</Link>
          </Button>
          <DeleteButton action={deletePost.bind(null, post.id)} />
        </div>
      )}
    </article>
  )
}
