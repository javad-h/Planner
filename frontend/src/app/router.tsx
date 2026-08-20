import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { TodayPage } from "@/pages/TodayPage"
import { PlansPage } from "@/pages/PlansPage"
import { PlanDetailsPage } from "@/pages/PlanDetailsPage"
import { DayDetailsPage } from "@/pages/DayDetailsPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <TodayPage /> },
      { path: "plans", element: <PlansPage /> },
      { path: "plans/:id", element: <PlanDetailsPage /> },
      { path: "plans/:planId/day/:date", element: <DayDetailsPage /> },
      { path: "settings", element: <div className="text-muted-foreground">تنظیمات - به زودی</div> },
    ],
  },
])
