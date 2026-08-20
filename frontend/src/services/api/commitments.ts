import type { CommitmentDto, CreateCommitmentRequest, UpdateCommitmentRequest } from "@/types/api"
import apiClient from "./client"

export const commitmentsService = {
  async create(planId: string, request: CreateCommitmentRequest): Promise<CommitmentDto> {
    const { data } = await apiClient.post<CommitmentDto>(
      `/api/Plans/${planId}/commitments`,
      request
    )
    return data
  },

  async update(id: string, request: UpdateCommitmentRequest): Promise<CommitmentDto> {
    const { data } = await apiClient.put<CommitmentDto>(
      `/api/Plans/commitments/${id}`,
      request
    )
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/Plans/commitments/${id}`)
  },
}
