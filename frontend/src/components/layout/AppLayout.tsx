import { Outlet, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowRight } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { Link } from "react-router-dom"

export function AppLayout() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/50 bg-card/80 px-4 py-3 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button asChild variant="ghost" size="icon" className="size-9">
              <Link to="/">
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          )}
          <h1 className="text-base font-bold text-foreground">Planner</h1>
        </div>

        <div className="flex items-center gap-1">
          {!isHomePage && (
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <Link to="/">امروز</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link to="/plans">برنامه‌ها</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <Outlet />
      </main>
    </div>
  )
}
