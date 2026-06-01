import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NICKNAME_SUGGESTIONS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomNickname(): string {
  return NICKNAME_SUGGESTIONS[Math.floor(Math.random() * NICKNAME_SUGGESTIONS.length)]
}
