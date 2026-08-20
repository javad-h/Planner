import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { plansService } from "@/services/api/plans"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, CalendarDays } from "lucide-react"
import { formatJalaliDate } from "@/lib/jalali"
import { EmptyState } from "@/components/EmptyState"
import { toast } from "sonner"
import type { CreatePlanRequest } from "@/types/api"

export function PlansPage() {
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (request: CreatePlanRequest) => plansService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      toast.success("برنامه با موفقیت ایجاد شد")
      setIsCreateOpen(false)
      resetForm()
    },
    onError: () => {
      toast.error("خطا در ایجاد برنامه")
    },
  })

  const resetForm = () => {
    setNewTitle("")
    setNewStartDate("")
    setNewEndDate("")
  }

  const handleCreate = () => {
    if (!newTitle.trim() || !newStartDate || !newEndDate) return
    createMutation.mutate({
      title: newTitle,
      startDate: newStartDate,
      endDate: newEndDate,
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground">برنامه‌ها</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive">خطا در دریافت برنامه‌ها</p>
            <p className="mt-1 text-sm text-muted-foreground">
              لطفاً اتصال سرور را بررسی کنید.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">برنامه‌ها</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus data-icon="inline-start" />
          برنامه جدید
        </Button>
      </div>

      {!plans || plans.length === 0 ? (
        <EmptyState
          title="هنوز برنامه‌ای ندارید"
          description="اولین برنامه خود را بسازید و شروع کنید."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus data-icon="inline-start" />
              ساخت برنامه
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <Link key={plan.id} to={`/plans/${plan.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="font-medium text-foreground">
                        {plan.title}
                      </h2>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                        <span>
                          {formatJalaliDate(plan.startDate)} تا{" "}
                          {formatJalaliDate(plan.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{plan.totalDays} روز</span>
                        <span>{plan.commitmentCount} تعهد</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>برنامه جدید</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plan-title">عنوان</Label>
              <Input
                id="plan-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: رشد شخصی شهریور"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-start">تاریخ شروع</Label>
                <Input
                  id="plan-start"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-end">تاریخ پایان</Label>
                <Input
                  id="plan-end"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              انصراف
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTitle.trim() || !newStartDate || !newEndDate || createMutation.isPending}
            >
              {createMutation.isPending ? "در حال ایجاد..." : "ایجاد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
