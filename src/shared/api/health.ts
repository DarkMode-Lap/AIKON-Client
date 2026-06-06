import { apiClient } from './client'

export type HealthResponse = Record<string, string>

export function checkHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/health')
}
