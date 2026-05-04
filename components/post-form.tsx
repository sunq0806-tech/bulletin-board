"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  )
}

type PostFormProps = {
  action: (formData: FormData) => Promise<void>
  defaultTitle?: string
  defaultContent?: string
  submitLabel?: string
  error?: string
}

export function PostForm({
  action,
  defaultTitle = "",
  defaultContent = "",
  submitLabel = "저장",
  error,
}: PostFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultTitle}
          placeholder="제목을 입력하세요"
          required
          maxLength={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={defaultContent}
          placeholder="내용을 입력하세요"
          required
          rows={10}
          className="resize-none"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <div className="flex gap-3">
        <SubmitButton label={submitLabel} />
        <Button type="button" variant="outline" onClick={() => history.back()}>
          취소
        </Button>
      </div>
    </form>
  )
}
