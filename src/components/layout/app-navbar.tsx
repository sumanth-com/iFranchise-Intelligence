"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, Menu } from "lucide-react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown"
import { UserNav } from "@/components/layout/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { NotificationItem } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { mainNavItems } from "@/lib/navigation"

type AppNavbarProps = {
  notifications: NotificationItem[]
}

export function AppNavbar({ notifications }: AppNavbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BrainCircuit className="size-5" />
              </div>
              <div className="text-left">
                <p className="font-heading text-sm font-semibold">iFranchise</p>
                <p className="text-xs font-normal text-muted-foreground">
                  Intelligence
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative max-w-md flex-1">
        <Input
          placeholder="Search opportunities, competitors, trends..."
          className="h-9 bg-muted/50 pl-4"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <NotificationsDropdown notifications={notifications} />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}

type DashboardShellProps = {
  children: React.ReactNode
  notifications: NotificationItem[]
}

export function DashboardShell({
  children,
  notifications,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppNavbar notifications={notifications} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-5 p-4 pt-5 sm:p-5 sm:pt-6 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
