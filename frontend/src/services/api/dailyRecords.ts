import type { DailyRecordDto, UpdateDailyRecordRequest } from "@/types/api"
import apiClient from "./client"

export const dailyRecordsService = {
  async getByPlanId(planId: string): Promise<DailyRecordDto[]> {
    const { data } = await apiClient.get<DailyRecordDto[]>(
      `/api/Plans/${planId}/daily-records`
    )
    return data
  },

  async getByPlanIdAndDate(planId: string, date: string): Promise<DailyRecordDto[]> {
    const { data } = await apiClient.get<DailyRecordDto[]>(
      `/api/Plans/${planId}/daily-records/${date}`
    )
    return data
  },

  async update(id: string, request: UpdateDailyRecordRequest): Promise<DailyRecordDto> {
    const { data } = await apiClient.put<DailyRecordDto>(
      `/api/Plans/daily-records/${id}`,
      request
    )
    return data
  },
}
