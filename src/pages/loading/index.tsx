import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { LOADING_MESSAGES } from '@/shared/lib/constants'
import { useAvatarCreation } from '@/features/create-avatar'
import type { AvatarStyle, AgeGroup, Gender } from '@/entities/avatar'

const EASE = [0.25, 0.46, 0.45, 0.94] as const
const MAGIC_EMOJIS = ['🎨', '✨', '🌟', '💫', '🦋', '🌈', '⭐', '🎭']

interface LocationState {
  image: File
  nickname: string
  gender: Gender
  style: AvatarStyle
  ageRange: AgeGroup
}

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
  const location = useLocation()
  const state = location.state as LocationState | null
  const nickname = state?.nickname ?? '친구'

  const { progress } = useAvatarCreation(state)

  const [emojiIdx, setEmojiIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setEmojiIdx((i) => (i + 1) % MAGIC_EMOJIS.length), 2800)
    return () => clearInterval(t)
  }, [])

  const msgIndex =
    progress >= 100
      ? LOADING_MESSAGES.length - 1
      : Math.min(
          Math.floor((progress / 99) * (LOADING_MESSAGES.length - 1)),
          LOADING_MESSAGES.length - 1,
        )
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
