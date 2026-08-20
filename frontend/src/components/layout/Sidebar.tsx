import { useState } from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Home,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { to: "/", label: "امروز", icon: Home },
  { to: "/plans", label: "برنامه‌ها", icon: ClipboardList },
]

const bottomItems = [
  { to: "/settings", label: "تنظیمات", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-l border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">Planner</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="size-8"
          aria-label={collapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <Separator />

      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <Separator />

      <div className="p-2">
        {bottomItems.map((item) => (
          <SidebarLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </div>
    </aside>
  )
}

interface SidebarLinkProps {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  collapsed: boolean
}

function SidebarLink({ to, label, icon: Icon, collapsed }: SidebarLinkProps) {
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
