import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { plansService } from "@/services/api/plans"
import { dailyRecordsService } from "@/services/api/dailyRecords"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, SkipForward, ChevronRight, ChevronLeft } from "lucide-react"
import {
  getJalaliToday,
  getJalaliMonthName,
  getDaysInJalaliMonth,
  getJalaliMonthStartDayOfWeek,
  jalaliToGregorian,
  getTodayIso,
} from "@/lib/jalali"
import { cn } from "@/lib/utils"
import type { DailyRecordDto, DailyRecordStatus } from "@/types/api"
import { toast } from "sonner"

const statusConfig: Record<
  DailyRecordStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Pending: { label: "در انتظار", variant: "outline" },
  Completed: { label: "انجام شده", variant: "default" },
  PartiallyCompleted: { label: "ناقص", variant: "secondary" },
  Skipped: { label: "رد شده", variant: "destructive" },
}

interface DayModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DayModal({ open, onOpenChange }: DayModalProps) {
  const queryClient = useQueryClient()
  const today = getJalaliToday()
  const todayIso = getTodayIso()

  const [viewMonth, setViewMonth] = useState(today.month)
  const [viewYear, setViewYear] = useState(today.year)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: plansService.getAll,
  })

  const activePlan = plans?.find((p) => {
    const start = new Date(p.startDate).toISOString().split("T")[0]
    const end = new Date(p.endDate).toISOString().split("T")[0]
    return todayIso >= start && todayIso <= end
  })

  const selectedDateIso = selectedDay
    ? jalaliToGregorian(viewYear, viewMonth, selectedDay)
    : null

  const { data: selectedRecords, isLoading: selectedLoading } = useQuery({
    queryKey: ["dailyRecords", activePlan?.id, selectedDateIso],
    queryFn: () =>
      dailyRecordsService.getByPlanIdAndDate(activePlan!.id, selectedDateIso!),
    enabled: !!activePlan && !!selectedDateIso,
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

  const daysInMonth = useMemo(
    () => getDaysInJalaliMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  )

  const startDayOfWeek = useMemo(
    () => getJalaliMonthStartDayOfWeek(viewYear, viewMonth),
    [viewYear, viewMonth]
  )

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }, [daysInMonth, startDayOfWeek])

  const dayLabels = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

  function goToPrevMonth() {
    if (viewMonth === 1) {
      setViewMonth(12)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
    setSelectedDay(null)
  }

  function goToNextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
    setSelectedDay(null)
  }

  function handleDayClick(day: number) {
    setSelectedDay(day === selectedDay ? null : day)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0" dir="rtl">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-center text-lg">
            تقویم روزانه
          </DialogTitle>
        </DialogHeader>

        <div className="px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={goToPrevMonth}
            >
              <ChevronRight className="size-4" />
            </Button>
            <span className="text-sm font-medium">
              {getJalaliMonthName(viewMonth)} {viewYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={goToNextMonth}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {dayLabels.map((label) => (
              <div
                key={label}
                className="py-1 text-center text-xs font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />
              }

              const isToday =
                day === today.day &&
                viewMonth === today.month &&
                viewYear === today.year
              const isSelected = day === selectedDay

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg text-sm transition-all",
                    "hover:bg-primary/10",
                    isToday &&
                      !isSelected &&
                      "bg-primary/15 font-bold text-primary",
                    isSelected && "bg-primary font-bold text-primary-foreground"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="mt-3 border-t px-4 pb-4 pt-3">
            <div className="mb-2 text-xs text-muted-foreground">
              {selectedDay} {getJalaliMonthName(viewMonth)} {viewYear}
            </div>

            {selectedLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : !activePlan ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                هیچ برنامه فعالی وجود ندارد
              </p>
            ) : !selectedRecords || selectedRecords.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                رکوردی برای این روز ثبت نشده
              </p>
            ) : (
              <div className="space-y-2">
                {selectedRecords.map((record) => (
                  <DayRecordCard
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
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface DayRecordCardProps {
  record: DailyRecordDto
  onQuickComplete: (id: string) => void
  onQuickSkip: (id: string) => void
  isUpdating: boolean
}

function DayRecordCard({
  record,
  onQuickComplete,
  onQuickSkip,
  isUpdating,
}: DayRecordCardProps) {
  const statusInfo = statusConfig[record.status]

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-3">
      <div className="flex flex-1 items-center gap-2">
        <span className="text-sm font-medium">{record.commitmentTitle}</span>
        <Badge variant={statusInfo.variant} className="text-xs">
          {statusInfo.label}
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        {record.status !== "Completed" && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-green-600 hover:text-green-700"
            onClick={() => onQuickComplete(record.id)}
            disabled={isUpdating}
            aria-label="تکمیل"
          >
            <Check className="size-3.5" />
          </Button>
        )}
        {record.status !== "Skipped" && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground"
            onClick={() => onQuickSkip(record.id)}
            disabled={isUpdating}
            aria-label="رد کردن"
          >
            <SkipForward className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
