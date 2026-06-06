import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { getAvatar } from '@/entities/avatar'
import type { AvatarStyle, AgeGroup, Gender } from '@/entities/avatar'
import { createAvatar } from './api'

export interface AvatarCreationState {
  image: File
  nickname: string
  gender: Gender
  style: AvatarStyle
  ageRange: AgeGroup
}

export function useAvatarCreation(state: AvatarCreationState | null): { progress: number } {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!state?.image) {
      navigate('/')
      return
    }

    // Exponential approach: pct = 99 * (1 - e^(-elapsed / TAU))
    // TAU = 0.8s: reaches ~99% in ~5 seconds, then holds until API confirms completion.
    const TAU = 800
    const tick = 100
    const MAX_WAIT_MS = 300_000
    let elapsed = 0
    let done = false
    let pollTimeout: ReturnType<typeof setTimeout>

    const progressTimer = setInterval(() => {
      if (done) return
      elapsed += tick
      setProgress(Math.min(99 * (1 - Math.exp(-elapsed / TAU)), 99))
    }, tick)

    const timeoutTimer = setTimeout(() => {
      if (done) return
      done = true
      clearInterval(progressTimer)
      clearTimeout(pollTimeout)
      toast.error('AI 생성에 시간이 너무 걸리고 있어요. 다시 시도해주세요 😢')
      navigate('/create')
    }, MAX_WAIT_MS)

    function complete(avatarId: number) {
      done = true
      clearInterval(progressTimer)
      clearTimeout(pollTimeout)
      clearTimeout(timeoutTimer)
      setProgress(100)
      setTimeout(() => {
        navigate(
          `/result/${avatarId}?nickname=${encodeURIComponent(state!.nickname)}&style=${state!.style}`,
        )
      }, 600)
    }

    async function poll(avatarId: number) {
      if (done) return
      try {
        const data = await getAvatar(avatarId)
        if (done) return
        if (data.generationStatus === 'FAILED') {
          done = true
          clearInterval(progressTimer)
          clearTimeout(timeoutTimer)
          toast.error('아바타 생성에 실패했어요. 다시 시도해주세요 😢')
          navigate('/create')
          return
        }
        if (data.imageUrl) {
          complete(avatarId)
          return
        }
      } catch {
        // ignore transient errors, keep polling
      }
      if (!done) pollTimeout = setTimeout(() => void poll(avatarId), 3000)
    }

    createAvatar({
      image: state.image,
      nickname: state.nickname,
      gender: state.gender,
      style: state.style,
      ageRange: state.ageRange,
    })
      .then((res) => {
        if (!done) void poll(res.id)
      })
      .catch((err) => {
        if (done) return
        const detail = err instanceof Error ? err.message : '알 수 없는 오류'
        toast.error(`아바타 생성 실패: ${detail}`)
        navigate('/create')
      })

    return () => {
      done = true
      clearInterval(progressTimer)
      clearTimeout(pollTimeout)
      clearTimeout(timeoutTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount; state is set by navigate and does not change
  }, [])

  return { progress }
}
