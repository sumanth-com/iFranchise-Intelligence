"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { deleteCompetitorAction } from "@/app/(platform)/competitors/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CompetitorListRow } from "@/lib/supabase/types"

type CompetitorDeleteDialogProps = {
  competitor: CompetitorListRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompetitorDeleteDialog({
  competitor,
  open,
  onOpenChange,
}: CompetitorDeleteDialogProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!competitor) return

    startTransition(async () => {
      const result = await deleteCompetitorAction(competitor.id)

      if (result.success) {
        toast.success(result.message)
        onOpenChange(false)
      } else {
        toast.error(result.message ?? "Failed to delete competitor.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>Delete Competitor</DialogTitle>
          <DialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">
              {competitor?.name}
            </span>
            {competitor && competitor.articles_count > 0
              ? ` and ${competitor.articles_count} linked article${competitor.articles_count === 1 ? "" : "s"}.`
              : "."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="px-0 pb-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
