"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CompetitorSearchProps = {
  defaultValue?: string
}

export function CompetitorSearch({ defaultValue = "" }: CompetitorSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function updateSearch(query: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }

    params.delete("page")

    startTransition(() => {
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    updateSearch(String(formData.get("q") ?? ""))
  }

  function handleClear() {
    updateSearch("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder="Search by name, website, or industry..."
          className="pl-9"
          disabled={isPending}
        />
      </div>
      <Button type="submit" variant="secondary" disabled={isPending}>
        Search
      </Button>
      {defaultValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          disabled={isPending}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </form>
  )
}

type CompetitorPaginationProps = {
  page: number
  totalPages: number
  total: number
  pageSize: number
  searchQuery?: string
}

export function CompetitorPagination({
  page,
  totalPages,
  total,
  pageSize,
  searchQuery = "",
}: CompetitorPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  function buildHref(targetPage: number) {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (targetPage > 1) params.set("page", String(targetPage))
    const qs = params.toString()
    return qs ? `/competitors?${qs}` : "/competitors"
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {total} competitors
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} asChild>
          <Link href={buildHref(page - 1)}>Previous</Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
          <Link href={buildHref(page + 1)}>Next</Link>
        </Button>
      </div>
    </div>
  )
}
