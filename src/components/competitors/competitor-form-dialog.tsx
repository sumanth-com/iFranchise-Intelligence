"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import {
  createCompetitorAction,
  updateCompetitorAction,
  type CompetitorActionState,
} from "@/app/(platform)/competitors/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CompetitorListRow } from "@/lib/supabase/types"

const initialState: CompetitorActionState = { success: false }

type CompetitorFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  competitor?: CompetitorListRow | null
}

export function CompetitorFormDialog({
  open,
  onOpenChange,
  competitor,
}: CompetitorFormDialogProps) {
  const isEditing = Boolean(competitor)

  const [state, formAction, isPending] = useActionState(
    isEditing && competitor
      ? updateCompetitorAction.bind(null, competitor.id)
      : createCompetitorAction,
    initialState
  )

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      onOpenChange(false)
    } else if (state.message && !state.fieldErrors) {
      toast.error(state.message)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Competitor" : "Add Competitor"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update competitor profile details."
              : "Track a new competitor in your intelligence network."}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Franchise India"
              defaultValue={competitor?.name ?? ""}
              required
              disabled={isPending}
            />
            {state.fieldErrors?.name && (
              <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              defaultValue={competitor?.website ?? ""}
              disabled={isPending}
            />
            {state.fieldErrors?.website && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.website[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              placeholder="Media & Marketplace"
              defaultValue={competitor?.industry ?? ""}
              disabled={isPending}
            />
            {state.fieldErrors?.industry && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.industry[0]}
              </p>
            )}
          </div>

          <DialogFooter className="px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Competitor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
