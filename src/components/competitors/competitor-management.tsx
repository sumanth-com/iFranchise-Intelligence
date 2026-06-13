"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"

import { CompetitorDeleteDialog } from "@/components/competitors/competitor-delete-dialog"
import { CompetitorFormDialog } from "@/components/competitors/competitor-form-dialog"
import {
  CompetitorPagination,
  CompetitorSearch,
} from "@/components/competitors/competitor-toolbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CompetitorListRow, PaginatedCompetitors } from "@/lib/supabase/types"

type CompetitorManagementProps = PaginatedCompetitors & {
  searchQuery?: string
}

export function CompetitorManagement({
  rows,
  total,
  page,
  pageSize,
  totalPages,
  searchQuery = "",
}: CompetitorManagementProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<CompetitorListRow | null>(null)

  function openCreate() {
    setSelected(null)
    setFormOpen(true)
  }

  function openEdit(competitor: CompetitorListRow) {
    setSelected(competitor)
    setFormOpen(true)
  }

  function openDelete(competitor: CompetitorListRow) {
    setSelected(competitor)
    setDeleteOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Competitor Directory</CardTitle>
            <CardDescription>
              Manage tracked competitors and monitor their article coverage.
            </CardDescription>
          </div>
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add Competitor
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <CompetitorSearch defaultValue={searchQuery} />

          {rows.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center">
              <p className="text-sm font-medium">
                {searchQuery ? "No competitors match your search." : "No competitors yet."}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Try a different search term or clear filters."
                  : "Add your first competitor to start tracking."}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={openCreate}>
                  <Plus className="size-4" />
                  Add Competitor
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead className="text-right">Articles</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((competitor) => (
                      <TableRow key={competitor.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/competitors/${competitor.id}`}
                            className="hover:text-primary hover:underline"
                          >
                            {competitor.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {competitor.website ? (
                            <a
                              href={competitor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <span className="max-w-[220px] truncate">
                                {competitor.website.replace(/^https?:\/\//, "")}
                              </span>
                              <ExternalLink className="size-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {competitor.industry ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{competitor.articles_count}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(competitor)}>
                                <Pencil className="size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => openDelete(competitor)}
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <CompetitorPagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                searchQuery={searchQuery}
              />
            </>
          )}
        </CardContent>
      </Card>

      <CompetitorFormDialog
        key={selected?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        competitor={selected}
      />

      <CompetitorDeleteDialog
        competitor={selected}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
