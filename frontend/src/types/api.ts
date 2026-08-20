export type CommitmentType = "Boolean" | "Quantitative"

export type DailyRecordStatus = "Pending" | "Completed" | "PartiallyCompleted" | "Skipped"

export interface PlanDto {
  id: string
  title: string | null
  startDate: string
  endDate: string
  totalDays: number
  commitmentCount: number
}

export interface CommitmentDto {
  id: string
  title: string | null
  type: CommitmentType
  targetValue: number | null
  unit: string | null
  planId: string
}

export interface DailyRecordDto {
  id: string
  date: string
  status: DailyRecordStatus
  actualValue: number | null
  note: string | null
  commitmentId: string
  commitmentTitle: string | null
}

export interface CreatePlanRequest {
  title: string | null
  startDate: string
  endDate: string
}

export interface UpdatePlanRequest {
  title: string | null
  startDate: string
  endDate: string
}

export interface CreateCommitmentRequest {
  title: string | null
  type: CommitmentType
  targetValue: number | null
  unit: string | null
}

export interface UpdateCommitmentRequest {
  title: string | null
  type: CommitmentType
  targetValue: number | null
  unit: string | null
}

export interface UpdateDailyRecordRequest {
  status: DailyRecordStatus
  actualValue: number | null
  note: string | null
}
