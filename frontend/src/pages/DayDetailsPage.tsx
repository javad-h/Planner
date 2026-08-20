import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dailyRecordsService } from "@/services/api/dailyRecords"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight } from "lucide-react"
import { formatJalaliDate } from "@/lib/jalali"
import { toast } from "sonner"
import type { DailyRecordDto, DailyRecordStatus } from "@/types/api"

const statusConfig: Record<
  DailyRecordStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Pending: { label: "در انتظار", variant: "outline" },
  Completed: { label: "انجام شده", variant: "default" },
  PartiallyCompleted: { label: "ناقص", variant: "secondary" },
  Skipped: { label: "رد شده", variant: "destructive" },
}

export function DayDetailsPage() {
  const { planId, date } = useParams<{ planId: string; date: string }>()
  const queryClient = useQueryClient()

  const { data: records, isLoading, error } = useQuery({
    queryKey: ["dailyRecords", planId, date],
    queryFn: () => dailyRecordsService.getByPlanIdAndDate(planId!, date!),
    enabled: !!planId && !!date,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: DailyRecordStatus
    }) =>
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link to={planId ? `/plans/${planId}` : "/plans"}>
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive">خطا در دریافت رکوردها</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to={planId ? `/plans/${planId}` : "/plans"}>
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowRight className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">جزئیات روز</h1>
          <p className="text-muted-foreground">
            {date ? formatJalaliDate(date) : ""}
          </p>
        </div>
      </div>

      {!records || records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              هیچ رکوردی برای این روز ثبت نشده است.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const statusInfo = statusConfig[record.status]

            return (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {record.commitmentTitle}
                        </h3>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {record.actualValue != null && (
                        <p className="text-sm text-muted-foreground">
                          مقدار انجام شده: {record.actualValue}
                        </p>
                      )}

                      {record.note && (
                        <p className="text-sm text-muted-foreground italic">
                          یادداشت: {record.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {record.status !== "Completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateMutation.mutate({
                              id: record.id,
                              status: "Completed",
                            })
                          }
                          disabled={updateMutation.isPending}
                        >
                          تکمیل
                        </Button>
                      )}
                      {record.status !== "Skipped" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateMutation.mutate({
                              id: record.id,
                              status: "Skipped",
                            })
                          }
                          disabled={updateMutation.isPending}
                        >
                          رد کردن
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
