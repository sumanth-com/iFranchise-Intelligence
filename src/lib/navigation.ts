import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Radar,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Competitor Intelligence",
    href: "/competitors",
    icon: Users,
  },
  {
    title: "Trend Intelligence",
    href: "/trends",
    icon: BarChart3,
  },
  {
    title: "Opportunity Radar",
    href: "/opportunities",
    icon: Radar,
  },
  {
    title: "Content Studio",
    href: "/content-studio",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]
