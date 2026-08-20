import { NavLink } from "react-router-dom"
import { Home, ClipboardList, Settings } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { to: "/", label: "امروز", icon: Home },
  { to: "/plans", label: "برنامه‌ها", icon: ClipboardList },
]

const bottomItems = [
  { to: "/settings", label: "تنظیمات", icon: Settings },
]

interface MobileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-64 p-0" dir="rtl">
        <SheetTitle className="sr-only">منوی ناوبری</SheetTitle>
        <div className="flex h-full flex-col">
          <div className="flex items-center p-4">
            <span className="text-lg font-bold text-foreground">Planner</span>
          </div>

          <Separator />

          <nav className="flex-1 p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onOpenChange(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <Separator />

          <div className="p-2">
            {bottomItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onOpenChange(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
