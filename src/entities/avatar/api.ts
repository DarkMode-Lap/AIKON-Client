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

function toProxyUrl(url: unknown): string | null {
  if (!url || typeof url !== 'string') return null
  if (!import.meta.env.DEV) return url
  try {
    const { pathname, search } = new URL(url)
    return pathname + search
  } catch {
    return url
  }
}

function parseAvatarRes(raw: Record<string, unknown> | null | undefined): GetAvatarRes {
  if (!raw) {
    return {
      id: 0,
      nickname: '',
      imageUrl: null,
      passUrl: null,
      qrUrl: null,
      generationStatus: null,
    }
  }
  return {
    id: raw['id'] as number,
    nickname: (raw['nickname'] as string) ?? '',
    imageUrl: toProxyUrl(raw['imageUrl']),
    passUrl: toProxyUrl(raw['passUrl']),
    qrUrl: toProxyUrl(raw['qrUrl']),
    generationStatus: (raw['generationStatus'] ?? null) as GetAvatarRes['generationStatus'],
  }
}

export async function getAvatar(id: number): Promise<GetAvatarRes> {
  try {
    const res = await apiClient.get<Record<string, unknown>>(`/avatars/${id}`)
    return parseAvatarRes(res.data)
  } catch (err) {
    throw new Error(extractErrorMessage(err), { cause: err })
  }
}

export async function getAvatarByPass(passUrl: string): Promise<GetAvatarRes> {
  try {
    const res = await apiClient.get<Record<string, unknown>>(`/avatars/pass/${passUrl}`)
    return parseAvatarRes(res.data)
  } catch (err) {
    throw new Error(extractErrorMessage(err), { cause: err })
  }
}
