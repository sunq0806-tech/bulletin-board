export const dynamic = "force-dynamic"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PostForm } from "@/components/post-form"
import { createPost } from "./actions"

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">새 글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm
            action={createPost}
            submitLabel="작성 완료"
            error={error ? decodeURIComponent(error) : undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}
