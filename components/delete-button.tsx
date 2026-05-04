"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm("정말 삭제하시겠습니까?")) return
    startTransition(() => action())
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "삭제 중..." : "삭제"}
    </Button>
  )
}
