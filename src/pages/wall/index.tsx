import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { subscribeToAvatarChanges, type AvatarListItem } from '@/shared/api'
import { AvatarGrid } from '@/widgets/avatar-wall'

const PARTICIPATE_URL = `${window.location.origin}/create`

export default function WallPage() {
  const [avatars, setAvatars] = useState<AvatarListItem[] | null>(null)

  useEffect(() => {
    const unsub = subscribeToAvatarChanges((list) => {
      setAvatars(list.filter((a) => a.generationStatus === 'COMPLETED' && a.imageUrl))
    })
    return unsub
  }, [])

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-white">
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-200 opacity-40 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-200 opacity-30 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <header className="relative z-10 flex-none border-b border-gray-100 px-8 py-6">
        <div className="flex items-stretch gap-4">
          <div className="w-1 flex-none rounded-full bg-violet-500" />
          <div>
            <h1 className="bg-linear-to-r from-violet-500 to-purple-600 bg-clip-text text-2xl font-black text-transparent">
              광주광역시교육청AI교육원
            </h1>
            <p className="mt-1 text-sm font-semibold text-violet-400">
              Your Digital Identity is ready.
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-6" style={{ perspective: '1000px' }}>
          {avatars === null && (
            <div className="flex h-full items-center justify-center text-sm font-bold text-gray-300">
              연결 중...
            </div>
          )}
          {avatars !== null && avatars.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm font-bold text-gray-300">
              아직 생성된 아바타가 없습니다
            </div>
          )}
          {avatars !== null && avatars.length > 0 && <AvatarGrid avatars={avatars} />}
        </main>

        <aside className="flex w-72 flex-none flex-col gap-8 border-l border-gray-100 px-6 py-8">
          <div>
            <p className="mb-3 text-xs font-black tracking-widest text-violet-400 uppercase">
              Live Statistics
            </p>
            <motion.p
              key={avatars?.length ?? 0}
              className="text-7xl font-black leading-none text-violet-500"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {avatars?.length ?? '-'}
            </motion.p>
            <p className="mt-2 text-sm font-semibold text-gray-400">Total AI Avatars</p>
          </div>

          <div>
            <p className="mb-4 text-xs font-black tracking-widest text-violet-400 uppercase">
              How to Participate
            </p>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 p-4 shadow-sm">
              <QRCodeSVG value={PARTICIPATE_URL} size={160} />
              <p className="text-xs font-semibold text-gray-400">{window.location.host}/create</p>
            </div>
            <p className="mt-4 text-center text-base font-black text-gray-800">QR 스캔하기</p>
            <p className="mt-1 text-center text-xs leading-5 text-gray-400">
              사진을 등록하고
              <br />
              아바타를 확인하세요.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
