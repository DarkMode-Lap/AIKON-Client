import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { LOADING_MESSAGES } from '@/shared/lib/constants'
import { createAvatar, getAvatar } from '@/shared/api/avatar'
import type { CreateAvatarRes } from '@/shared/api/avatar'
import type { AvatarStyle, AgeGroup, Gender } from '@/shared/types'

const EASE = [0.25, 0.46, 0.45, 0.94] as const
const MAGIC_EMOJIS = ['🎨', '✨', '🌟', '💫', '🦋', '🌈', '⭐', '🎭']

interface LocationState {
  image: File
  nickname: string
  gender: Gender
  style: AvatarStyle
  ageRange: AgeGroup
}

// Module-level: shared across Strict Mode double-invocations so only one POST fires.
// Cleared after the Promise settles so re-entry from a fresh navigation starts clean.
let pendingCreate: Promise<CreateAvatarRes> | null = null

function ProgressRing({ progress }: { progress: number }) {
  const r = 64
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
      <defs>
        <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CA83FF" />
          <stop offset="100%" stopColor="#FF53BD" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r={r} fill="none" stroke="#ede9fe" strokeWidth="8" />
      <circle
        cx="80"
        cy="80"
        r={r}
        fill="none"
        stroke="url(#pgGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  )
}

export default function LoadingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  const nickname = state?.nickname ?? '친구'
  const style = state?.style ?? 'ghibli'

  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [emojiIdx, setEmojiIdx] = useState(0)

  useEffect(() => {
    if (!state?.image) {
      navigate('/')
      return
    }

    // Exponential approach: pct = 99 * (1 - e^(-elapsed / TAU))
    // TAU = 0.8s: reaches ~99% in ~5 seconds, then holds until API confirms completion.
    // 1s→71%, 2s→92%, 3s→97%, 5s→99%
    const TAU = 800          // time constant (ms) — smaller = faster early progress
    const tick = 100         // 100ms tick for smooth sub-percent animation
    const MAX_WAIT_MS = 300_000 // 5 minutes — give up and show error after this
    let elapsed = 0
    let done = false
    let pollTimeout: ReturnType<typeof setTimeout>

    const progressTimer = setInterval(() => {
      if (done) return
      elapsed += tick
      const pct = Math.min(99 * (1 - Math.exp(-elapsed / TAU)), 99)
      setProgress(pct)
      const msgIdx = Math.floor((pct / 99) * (LOADING_MESSAGES.length - 1))
      setMsgIndex(Math.min(msgIdx, LOADING_MESSAGES.length - 1))
    }, tick)

    const emojiTimer = setInterval(() => {
      setEmojiIdx((i) => (i + 1) % MAGIC_EMOJIS.length)
    }, 2800)

    const timeoutTimer = setTimeout(() => {
      if (done) return
      done = true
      clearInterval(progressTimer)
      clearInterval(emojiTimer)
      clearTimeout(pollTimeout)
      toast.error('AI 생성에 시간이 너무 걸리고 있어요. 다시 시도해주세요 😢')
      navigate('/create')
    }, MAX_WAIT_MS)

    function complete(avatarId: number) {
      done = true
      clearInterval(progressTimer)
      clearInterval(emojiTimer)
      clearTimeout(pollTimeout)
      clearTimeout(timeoutTimer)
      setProgress(100)
      setMsgIndex(LOADING_MESSAGES.length - 1)
      setTimeout(() => {
        navigate(`/result/${avatarId}?nickname=${encodeURIComponent(nickname)}&style=${style}`)
      }, 600)
    }

    async function poll(avatarId: number) {
      if (done) return
      try {
        const data = await getAvatar(avatarId)
        if (data.generationStatus === 'FAILED') {
          done = true
          clearInterval(progressTimer)
          clearInterval(emojiTimer)
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

    // Reuse an in-flight promise if one exists (guards against Strict Mode double-invoke).
    // Each mount registers its own .then/.catch so only the live mount's closure is used.
    if (!pendingCreate) {
      pendingCreate = createAvatar({
        image: state.image,
        nickname: state.nickname,
        gender: state.gender,
        style: state.style,
        ageRange: state.ageRange,
      })
    }

    pendingCreate
      .then((res) => {
        pendingCreate = null
        if (!done) void poll(res.id)
      })
      .catch((err) => {
        pendingCreate = null
        if (done) return
        const detail = err instanceof Error ? err.message : '알 수 없는 오류'
        toast.error(`아바타 생성 실패: ${detail}`)
        navigate('/create')
      })

    return () => {
      done = true
      clearInterval(progressTimer)
      clearInterval(emojiTimer)
      clearTimeout(pollTimeout)
      clearTimeout(timeoutTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount; state is set by navigate and does not change
  }, [])

  const currentMsg = LOADING_MESSAGES[msgIndex]

  return (
    <div className="fade-in relative min-h-dvh bg-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-violet-300 blur-3xl opacity-60"
          animate={{ x: [0, 70, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-pink-300 blur-3xl opacity-60"
          animate={{ x: [0, -70, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <ProgressRing progress={progress} />
          <AnimatePresence mode="wait">
            <motion.div
              key={emojiIdx}
              className="text-5xl select-none"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              {MAGIC_EMOJIS[emojiIdx]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xl font-black text-gray-900">
            {nickname}
            <span className="text-violet-500">의 캐릭터</span>
          </p>
          <p className="text-sm text-gray-400">AI가 열심히 그리는 중...</p>
        </div>

        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2"
            >
              <span className="text-lg">{currentMsg.emoji}</span>
              <span className="text-sm font-bold text-violet-700">{currentMsg.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-sm font-black text-violet-600">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
