export type AvatarStyle = 'ghibli' | 'disney' | 'hanbok' | 'game' | 'studio' | 'watercolor'
export type AgeGroup = '0-7' | '8-13' | '14-19' | '20+'
export type Gender = 'male' | 'female'
export type AvatarStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface StyleOption {
  id: AvatarStyle
  label: string
  emoji: string
  description: string
  gradient: string
}

export interface AvatarJob {
  id: string
  nickname: string
  style: AvatarStyle
  ageGroup: AgeGroup
  gender: Gender
  status: AvatarStatus
  resultImageUrl?: string
  createdAt: string
}

export interface CreateFormData {
  nickname: string
  style: AvatarStyle | null
  ageGroup: AgeGroup | null
  gender: Gender | null
  photoFile: File | null
  photoPreview: string | null
}
