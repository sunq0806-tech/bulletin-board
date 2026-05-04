export const dynamic = "force-dynamic"

import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, content, user_id, created_at, updated_at")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">게시글 목록</h1>
        <Button asChild variant="outline">
          <Link href="/posts/new">글쓰기</Link>
        </Button>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">아직 게시글이 없습니다.</p>
          <p className="text-sm mt-2">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
