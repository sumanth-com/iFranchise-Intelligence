"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit } from "lucide-react"

import { cn } from "@/lib/utils"
import { mainNavItems } from "@/lib/navigation"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold">iFranchise</p>
          <p className="truncate text-xs text-muted-foreground">Intelligence</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
          <p className="text-xs font-medium text-primary">Pro Plan</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlimited market scans & AI content
          </p>
        </div>
      </div>
    </aside>
  )
}
