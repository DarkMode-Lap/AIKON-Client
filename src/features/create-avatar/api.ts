import axios from 'axios'
import apiClient from '@/shared/api/client'
import type { AvatarStyle, AgeGroup, Gender } from '@/entities/avatar'

export interface CreateAvatarRes {
  id: number
  generationStatus: 'WAITING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING'
}

const STYLE_MAP: Record<AvatarStyle, string> = {
  ghibli: 'GHIBLI',
  disney: 'DISNEY_PIXAR',
  hanbok: 'TRADITIONAL_HANBOK',
  game: 'ZOOTOPIA',
  watercolor: 'LIGHT_ART',
  studio: 'STUDIO',
}

const AGE_MAP: Record<AgeGroup, string> = {
  '0-7': 'AGE_0_7',
  '8-13': 'AGE_8_13',
  '14-19': 'AGE_14_19',
  '20+': 'AGE_20_PLUS',
}

const GENDER_MAP: Record<Gender, string> = {
  male: 'MALE',
  female: 'FEMALE',
}

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined
    if (data) return String(data['message'] ?? data['error'] ?? data['detail'] ?? err.message)
    return err.message
  }
  return err instanceof Error ? err.message : '알 수 없는 오류'
}

export async function createAvatar(data: {
  image: File
  nickname: string
  gender: Gender
  style: AvatarStyle
  ageRange: AgeGroup
}): Promise<CreateAvatarRes> {
  const formData = new FormData()
  const reqDto = {
    nickname: data.nickname,
    gender: GENDER_MAP[data.gender],
    style: STYLE_MAP[data.style],
    ageRange: AGE_MAP[data.ageRange],
  }
  formData.append('reqDto', new Blob([JSON.stringify(reqDto)], { type: 'application/json' }))
  formData.append('image', data.image)

  try {
    const res = await apiClient.post<CreateAvatarRes>('/avatars', formData)
    return res.data
  } catch (err) {
    throw new Error(extractErrorMessage(err), { cause: err })
  }
}
