import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import { getAvatar } from '@/entities/avatar'
import type { GetAvatarRes } from '@/entities/avatar'

interface UseAvatarResultReturn {
  id: string
  nickname: string
  style: string
  imageUrl: string
  passUrl: string
  avatarData: GetAvatarRes | null
  handleDownload: () => void
  handleShare: () => void
}

export function useAvatarResult(): UseAvatarResultReturn {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const nickname = searchParams.get('nickname') ?? '친구'
  const style = searchParams.get('style') ?? 'ghibli'

  const [avatarData, setAvatarData] = useState<GetAvatarRes | null>(null)

  useEffect(() => {
    const avatarId = Number(id)
    if (!id || isNaN(avatarId)) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let retryCount = 0
    const MAX_RETRIES = 5

    async function poll() {
      if (cancelled) return
      try {
        const data = await getAvatar(avatarId)
        if (cancelled) return
        setAvatarData(data)
        const done =
          data.generationStatus === 'COMPLETED' ||
          data.generationStatus === 'FAILED' ||
          !!data.imageUrl
        if (!done) timer = setTimeout(poll, 3000)
      } catch {
        if (cancelled) return
        retryCount++
        if (retryCount >= MAX_RETRIES) {
          toast.error('아바타 정보를 불러오는 데 실패했습니다. 😢')
          return
        }
        timer = setTimeout(poll, 3000)
      }
    }

    void poll()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [id])

  const imageUrl = avatarData?.imageUrl ?? ''

  function handleDownload() {
    if (!imageUrl) {
      toast('이미지를 불러오는 중이에요. 잠시 후 다시 시도해주세요. 📁')
      return
    }
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aikon_${nickname}_${id}.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 100)
      })
      .catch(() => toast.error('이미지 다운로드에 실패했어요. 😢'))
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: `${nickname}의 AI PASS`,
          text: '광주AI교육원에서 만든 나만의 AI 캐릭터! 🌟',
          url: window.location.href,
        })
        .catch(() => null)
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success('링크가 복사됐어요! 📋'))
        .catch(() => toast.error('링크 복사에 실패했어요. 😢'))
    } else {
      toast.error('이 브라우저에서는 링크 복사를 지원하지 않아요. 😢')
    }
  }

  const appOrigin = import.meta.env.VITE_APP_URL ?? window.location.origin
  const passUrl = avatarData?.passUrl
    ? `${appOrigin}/pass/${avatarData.passUrl}`
    : `${appOrigin}/pass/Aikon${id ?? ''}`

  return { id: id ?? '', nickname, style, imageUrl, passUrl, avatarData, handleDownload, handleShare }
}
