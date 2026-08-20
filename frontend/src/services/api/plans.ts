import type { PlanDto, CreatePlanRequest, UpdatePlanRequest } from "@/types/api"
import apiClient from "./client"

export const plansService = {
  async getAll(): Promise<PlanDto[]> {
    const { data } = await apiClient.get<PlanDto[]>("/api/Plans")
    return data
  },

  async getById(id: string): Promise<PlanDto> {
    const { data } = await apiClient.get<PlanDto>(`/api/Plans/${id}`)
    return data
  },

  async create(request: CreatePlanRequest): Promise<PlanDto> {
    const { data } = await apiClient.post<PlanDto>("/api/Plans", request)
    return data
  },

  async update(id: string, request: UpdatePlanRequest): Promise<PlanDto> {
    const { data } = await apiClient.put<PlanDto>(`/api/Plans/${id}`, request)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/Plans/${id}`)
  },
}
