import { apiClient, BASE_URL } from './client'

export type GenerationStatus = 'WAITING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING'
export type AvatarGender = 'MALE' | 'FEMALE'
export type AvatarAgeRange = 'AGE_0_7' | 'AGE_8_13' | 'AGE_14_19' | 'AGE_20_PLUS'
export type AvatarStyleCode =
  | 'STUDIO'
  | 'ZOOTOPIA'
  | 'TRADITIONAL_HANBOK'
  | 'DISNEY_PIXAR'
  | 'GHIBLI'
  | 'LIGHT_ART'

export type AvatarResponse = {
  id: number
  nickname: string
  imageUrl: string
  passUrl: string
  gender?: AvatarGender
  ageRange?: AvatarAgeRange
  style?: AvatarStyleCode
  generationStatus?: GenerationStatus
}

export type CreateAvatarResponse = {
  id: number
  generationStatus: GenerationStatus
}

export function getAvatar(avatarId: number): Promise<AvatarResponse> {
  return apiClient.get<AvatarResponse>(`/avatars/${avatarId}`)
}

export function deleteAvatar(avatarId: number): Promise<void> {
  return apiClient.delete<void>(`/avatars/${avatarId}`)
}

export function deleteAllAvatars(): Promise<void> {
  return apiClient.delete<void>('/avatars')
}

export type AvatarListItem = {
  id?: number
  nickname: string
  style?: string
  gender?: AvatarGender
  ageRange?: AvatarAgeRange
  generationStatus?: GenerationStatus
  imageUrl?: string
  passUrl?: string
  createdAt?: string
}

export function subscribeToAvatarChanges(
  onEvent: (avatars: AvatarListItem[]) => void,
  onError?: (e: Event) => void,
): () => void {
  const es = new EventSource(`${BASE_URL}/avatars/changes`)
  es.addEventListener('avatar-list-changed', (e: MessageEvent<string>) => {
    try {
      onEvent(JSON.parse(e.data) as AvatarListItem[])
    } catch {
      // ignore malformed events
    }
  })
  if (onError) es.onerror = onError
  return () => es.close()
}
