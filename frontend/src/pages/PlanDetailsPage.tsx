import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { plansService } from "@/services/api/plans"
import { commitmentsService } from "@/services/api/commitments"
import { dailyRecordsService } from "@/services/api/dailyRecords"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, ArrowRight, CalendarDays } from "lucide-react"
import { formatJalaliDate } from "@/lib/jalali"
import { EmptyState } from "@/components/EmptyState"
import { toast } from "sonner"
import type { CreateCommitmentRequest, DailyRecordDto } from "@/types/api"

export function PlanDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const [isAddCommitmentOpen, setIsAddCommitmentOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState<"Boolean" | "Quantitative">("Boolean")
  const [newTarget, setNewTarget] = useState("")
  const [newUnit, setNewUnit] = useState("")

  const { data: plan, isLoading: planLoading, error: planError } = useQuery({
    queryKey: ["plan", id],
    queryFn: () => plansService.getById(id!),
    enabled: !!id,
  })

  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: ["dailyRecords", id],
    queryFn: () => dailyRecordsService.getByPlanId(id!),
    enabled: !!id,
  })

  const createCommitmentMutation = useMutation({
    mutationFn: (request: CreateCommitmentRequest) =>
      commitmentsService.create(id!, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", id] })
      toast.success("تعهد با موفقیت اضافه شد")
      setIsAddCommitmentOpen(false)
      resetForm()
    },
    onError: () => {
      toast.error("خطا در افزودن تعهد")
    },
  })

  const resetForm = () => {
    setNewTitle("")
    setNewType("Boolean")
    setNewTarget("")
    setNewUnit("")
  }

  const handleAddCommitment = () => {
    if (!newTitle.trim()) return
    createCommitmentMutation.mutate({
      title: newTitle,
      type: newType,
      targetValue: newType === "Quantitative" ? parseFloat(newTarget) || null : null,
      unit: newType === "Quantitative" ? newUnit || null : null,
    })
  }

  const isLoading = planLoading || recordsLoading

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (planError || !plan) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/plans">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive">خطا در دریافت برنامه</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recordsByDate = records?.reduce<Record<string, DailyRecordDto[]>>(
    (acc, record) => {
      const dateKey = record.date.split("T")[0]
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(record)
      return acc
    },
    {}
  ) ?? {}

  const sortedDates = Object.keys(recordsByDate).sort().reverse()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/plans">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowRight className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{plan.title}</h1>
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

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">افزودن تعهد</h2>
        <Button onClick={() => setIsAddCommitmentOpen(true)} size="sm">
          <Plus data-icon="inline-start" />
          افزودن تعهد
        </Button>
      </div>

      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                هیچ رکوردی ثبت نشده است.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map((dateKey) => (
            <div key={dateKey} className="space-y-3">
              <h3 className="font-medium text-foreground">
                {formatJalaliDate(dateKey)}
              </h3>
              <div className="space-y-2">
                {recordsByDate[dateKey].map((record) => (
                  <Link
                    key={record.id}
                    to={`/plans/${id}/day/${dateKey}`}
                  >
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {record.commitmentTitle}
                            </span>
                            <Badge
                              variant={
                                record.status === "Completed"
                                  ? "default"
                                  : record.status === "Skipped"
                                    ? "destructive"
                                    : record.status === "PartiallyCompleted"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {record.status === "Completed"
                                ? "انجام شده"
                                : record.status === "Skipped"
                                  ? "رد شده"
                                  : record.status === "PartiallyCompleted"
                                    ? "ناقص"
                                    : "در انتظار"}
                            </Badge>
                          </div>
                          {record.actualValue != null && (
                            <span className="text-sm text-muted-foreground">
                              {record.actualValue}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isAddCommitmentOpen} onOpenChange={setIsAddCommitmentOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>افزودن تعهد</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="commitment-title">عنوان</Label>
              <Input
                id="commitment-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: کتاب خواندن"
              />
            </div>

            <div className="space-y-2">
              <Label>نوع</Label>
              <Select
                value={newType}
                onValueChange={(v: "Boolean" | "Quantitative") => setNewType(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boolean">بله/خیر</SelectItem>
                  <SelectItem value="Quantitative">کمی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newType === "Quantitative" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commitment-target">مقدار هدف</Label>
                  <Input
                    id="commitment-target"
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commitment-unit">واحد</Label>
                  <Input
                    id="commitment-unit"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="دقیقه"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddCommitmentOpen(false)
                resetForm()
              }}
            >
              انصراف
            </Button>
            <Button
              onClick={handleAddCommitment}
              disabled={!newTitle.trim() || createCommitmentMutation.isPending}
            >
              {createCommitmentMutation.isPending ? "در حال افزودن..." : "افزودن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
