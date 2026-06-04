import axios from 'axios'
import apiClient from '@/shared/api/client'
import type { GetAvatarRes } from './model'

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined
    if (data) return String(data['message'] ?? data['error'] ?? data['detail'] ?? err.message)
    return err.message
  }
  return err instanceof Error ? err.message : '알 수 없는 오류'
}

export async function getAvatar(id: number): Promise<GetAvatarRes> {
  try {
    const res = await apiClient.get<Record<string, unknown>>(`/avatars/${id}`)
    const raw = res.data
    // Normalize snake_case ↔ camelCase so the poll works regardless of server convention
    return {
      id: raw['id'] as number,
      nickname: (raw['nickname'] as string) ?? '',
      imageUrl: (raw['imageUrl'] ?? raw['image_url'] ?? null) as string | null,
      passUrl: (raw['passUrl'] ?? raw['pass_url'] ?? null) as string | null,
      generationStatus: (raw['generationStatus'] ??
        raw['generation_status'] ??
        null) as GetAvatarRes['generationStatus'],
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err), { cause: err })
  }
}
