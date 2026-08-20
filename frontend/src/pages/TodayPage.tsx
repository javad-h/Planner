import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { plansService } from "@/services/api/plans"
import { dailyRecordsService } from "@/services/api/dailyRecords"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DayModal } from "@/components/DayModal"
import { Check, SkipForward, CalendarDays } from "lucide-react"
import {
  formatJalaliDate,
  getTodayIso,
  getJalaliToday,
  getJalaliMonthName,
  getJalaliDayName,
} from "@/lib/jalali"
import { cn } from "@/lib/utils"
import type { DailyRecordDto, DailyRecordStatus } from "@/types/api"
import { toast } from "sonner"

const statusConfig: Record<
  DailyRecordStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  Pending: { label: "در انتظار", variant: "outline", color: "border-muted-foreground/30" },
  Completed: { label: "انجام شده", variant: "default", color: "border-green-500" },
  PartiallyCompleted: { label: "ناقص", variant: "secondary", color: "border-amber-500" },
  Skipped: { label: "رد شده", variant: "destructive", color: "border-red-400" },
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "صبح بخیر"
  if (hour < 17) return "عصر بخیر"
  return "شب بخیر"
}

export function TodayPage() {
  const queryClient = useQueryClient()
  const [dayModalOpen, setDayModalOpen] = useState(false)

  const today = getTodayIso()
  const todayJalali = getJalaliToday()
  const todayJalaliFormatted = formatJalaliDate(today)
  const dayName = getJalaliDayName(today)

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getAll,
  })

  const activePlan = plans?.find((p) => {
    const start = new Date(p.startDate).toISOString().split("T")[0]
    const end = new Date(p.endDate).toISOString().split("T")[0]
    return today >= start && today <= end
  })

  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: ["dailyRecords", activePlan?.id, today],
    queryFn: () => dailyRecordsService.getByPlanIdAndDate(activePlan!.id, today),
    enabled: !!activePlan,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DailyRecordStatus }) =>
      dailyRecordsService.update(id, {
        status,
        actualValue: null,
        note: null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyRecords"] })
      toast.success("وضعیت به‌روزرسانی شد")
    },
    onError: () => {
      toast.error("خطا در به‌روزرسانی وضعیت")
    },
  })

  const isLoading = plansLoading || (!!activePlan && recordsLoading)
  const completedCount = records?.filter((r) => r.status === "Completed").length ?? 0
  const totalCount = records?.length ?? 0
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-5 px-4 py-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-18 w-full rounded-xl" />
          <Skeleton className="h-18 w-full rounded-xl" />
          <Skeleton className="h-18 w-full rounded-xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    )
  }

  if (!activePlan) {
    return (
      <div className="mx-auto max-w-lg space-y-5 px-4 py-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">{getGreeting()}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {dayName}، {todayJalaliFormatted}
          </p>
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/60 bg-card px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <CalendarDays className="size-7 text-primary" />
          </div>
          <p className="font-medium text-foreground">هیچ برنامه فعالی ندارید</p>
          <p className="mt-1 text-sm text-muted-foreground">
            یک برنامه بسازید و شروع کنید
          </p>
          <Button asChild className="mt-5">
            <Link to="/plans">رفتن به برنامه‌ها</Link>
          </Button>
        </div>

        <DateCard
          todayJalali={todayJalali}
          onOpenCalendar={() => setDayModalOpen(true)}
        />

        <DayModal open={dayModalOpen} onOpenChange={setDayModalOpen} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 py-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">{getGreeting()}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {dayName}، {todayJalaliFormatted}
        </p>
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {activePlan.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {completedCount} از {totalCount}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {progressPercent}% پیشرفت
        </p>
      </div>

      <div className="space-y-2.5">
        {records && records.length > 0 ? (
          records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onQuickComplete={(id) =>
                updateMutation.mutate({ id, status: "Completed" })
              }
              onQuickSkip={(id) =>
                updateMutation.mutate({ id, status: "Skipped" })
              }
              isUpdating={updateMutation.isPending}
            />
          ))
        ) : records && records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              رکوردی برای امروز ثبت نشده
            </p>
          </div>
        ) : null}
      </div>

      <DateCard
        todayJalali={todayJalali}
        onOpenCalendar={() => setDayModalOpen(true)}
      />

      <DayModal open={dayModalOpen} onOpenChange={setDayModalOpen} />
    </div>
  )
}

interface DateCardProps {
  todayJalali: { year: number; month: number; day: number }
  onOpenCalendar: () => void
}

function DateCard({ todayJalali, onOpenCalendar }: DateCardProps) {
  return (
    <button
      onClick={onOpenCalendar}
      className="w-full cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/30 p-5 text-center transition-all hover:shadow-md hover:from-primary/15 hover:via-primary/8 hover:to-accent/40 active:scale-[0.98]"
    >
      <p className="text-3xl font-bold tracking-tight text-primary">
        {todayJalali.day}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground">
        {getJalaliMonthName(todayJalali.month)} {todayJalali.year}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        تقویم روزانه ←
      </p>
    </button>
  )
}

interface RecordCardProps {
  record: DailyRecordDto
  onQuickComplete: (id: string) => void
  onQuickSkip: (id: string) => void
  isUpdating: boolean
}

function RecordCard({
  record,
  onQuickComplete,
  onQuickSkip,
  isUpdating,
}: RecordCardProps) {
  const statusInfo = statusConfig[record.status]

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-all hover:shadow-md",
        "border-r-[3px]",
        statusInfo.color
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {record.commitmentTitle}
          </span>
          <Badge variant={statusInfo.variant} className="shrink-0 text-[10px] px-1.5 py-0">
            {statusInfo.label}
          </Badge>
        </div>
        {record.actualValue != null && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            مقدار: {record.actualValue}
          </p>
        )}
        {record.note && (
          <p className="mt-0.5 text-xs text-muted-foreground italic truncate">
            {record.note}
          </p>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {record.status !== "Completed" && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
            onClick={() => onQuickComplete(record.id)}
            disabled={isUpdating}
            aria-label="تکمیل"
          >
            <Check className="size-4" />
          </Button>
        )}
        {record.status !== "Skipped" && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={() => onQuickSkip(record.id)}
            disabled={isUpdating}
            aria-label="رد کردن"
          >
            <SkipForward className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
