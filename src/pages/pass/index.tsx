import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getAvatar, getAvatarByPass } from '@/entities/avatar'
import type { GetAvatarRes } from '@/entities/avatar'
import { STYLE_OPTIONS } from '@/shared/lib/constants'

function AvatarPlaceholder({ style, nickname }: { style: string; nickname: string }) {
  const styleInfo = STYLE_OPTIONS.find((s) => s.id === style)
  return (
    <div
      className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center bg-linear-to-br ${styleInfo?.gradient ?? 'from-violet-500 to-purple-700'}`}
    >
      <div className="text-7xl mb-3">{styleInfo?.emoji ?? '🌟'}</div>
      <p className="text-white font-black text-xl">{nickname}</p>
    </div>
  )
}

export default function PassPage() {
  const { passId } = useParams<{ passId: string }>()
  const [avatarData, setAvatarData] = useState<GetAvatarRes | null>(null)
  const [loading, setLoading] = useState(Boolean(passId))

  useEffect(() => {
    if (!passId) return

    const currentPassId = passId
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let retryCount = 0
    const MAX_RETRIES = 5

    const numericId = parseInt(currentPassId.replace(/^Aikon/i, ''), 10)

    async function poll() {
      if (cancelled) return
      try {
        const data = await getAvatarByPass(currentPassId).catch(() => {
          if (!isNaN(numericId)) return getAvatar(numericId)
          throw new Error('not found')
        })
        if (cancelled) return
        setAvatarData(data)
        const done =
          data.generationStatus === 'COMPLETED' ||
          data.generationStatus === 'FAILED' ||
          !!data.imageUrl
        if (!done) timer = setTimeout(poll, 3000)
        else setLoading(false)
      } catch {
        if (cancelled) return
        retryCount++
        if (retryCount >= MAX_RETRIES) {
          toast.error('아바타 정보를 불러오는 데 실패했습니다. 😢')
          setLoading(false)
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
  }, [passId])

  const nickname = avatarData?.nickname ?? ''
  const imageUrl = avatarData?.imageUrl ?? ''

  return (
    <div className="fade-in relative min-h-dvh bg-white flex flex-col items-center px-4 py-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-300 blur-3xl opacity-60"
          animate={{ x: [0, 70, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-300 blur-3xl opacity-60"
          animate={{ x: [0, -70, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm text-center mb-6">
        <p className="text-xs font-bold text-violet-500 tracking-widest uppercase mb-1">AI PASS</p>
        <h1 className="text-2xl font-black text-gray-900">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 to-pink-500">
            {nickname || passId}
          </span>
          {nickname ? '님의 아바타' : ''}
        </h1>
        <p className="text-xs text-gray-400 mt-1">광주AI교육원 AI PASS 발급 시스템</p>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {loading ? (
            <div className="w-full aspect-square flex items-center justify-center bg-gray-50">
              <div className="text-violet-500 text-sm font-bold animate-pulse">생성 중...</div>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`${nickname}의 아바타`}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <AvatarPlaceholder style="" nickname={nickname || (passId ?? '')} />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 pb-4">
          © 광주AI교육원 · AI PASS 발급 시스템
        </p>
      </div>
    </div>
  )
}
