import { DashboardShell } from "@/components/layout/app-navbar"
import { AppToaster } from "@/components/ui/sonner"
import { getNotifications } from "@/lib/supabase/queries"

export const dynamic = "force-dynamic"

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const notifications = await getNotifications()

  return (
    <>
      <DashboardShell notifications={notifications}>{children}</DashboardShell>
      <AppToaster />
    </>
  )
}
