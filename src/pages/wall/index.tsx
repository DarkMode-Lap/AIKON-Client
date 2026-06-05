import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { subscribeToAvatarChanges, type AvatarListItem } from '@/shared/api'
import { AvatarGrid } from '@/widgets/avatar-wall'

const EXAMPLE_AVATARS: AvatarListItem[] = [
  {
    nickname: '양천나이키',
    imageUrl: 'https://picsum.photos/seed/aikon1/400/400',
    generationStatus: 'COMPLETED',
  },
  {
    nickname: 'Sindy gall',
    imageUrl: 'https://picsum.photos/seed/aikon2/400/400',
    generationStatus: 'COMPLETED',
  },
  {
    nickname: '포근한오렌지',
    imageUrl: 'https://picsum.photos/seed/aikon3/400/400',
    generationStatus: 'COMPLETED',
  },
  {
    nickname: '영리한호랑이',
    imageUrl: 'https://picsum.photos/seed/aikon4/400/400',
    generationStatus: 'COMPLETED',
  },
  {
    nickname: '침착한거북이',
    imageUrl: 'https://picsum.photos/seed/aikon5/400/400',
    generationStatus: 'COMPLETED',
  },
  {
    nickname: '침착한다람쥐',
    imageUrl: 'https://picsum.photos/seed/aikon6/400/400',
    generationStatus: 'COMPLETED',
  },
]

const PARTICIPATE_URL = `${window.location.origin}/create`

export default function WallPage() {
  const [avatars, setAvatars] = useState<AvatarListItem[]>([])

  useEffect(() => {
    const unsub = subscribeToAvatarChanges((list) => {
      setAvatars(list.filter((a) => a.generationStatus === 'COMPLETED' && a.imageUrl))
    })
    return unsub
  }, [])

  const allAvatars = [...EXAMPLE_AVATARS, ...avatars]

  return (
    <div className="min-h-dvh bg-white flex flex-col relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-200 blur-3xl opacity-40"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-pink-200 blur-3xl opacity-30"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <header className="relative z-10 flex-none px-8 py-6 border-b border-gray-100">
        <div className="flex items-stretch gap-4">
          <div className="w-1 rounded-full bg-violet-500 flex-none" />
          <div>
            <h1 className="text-2xl font-black bg-linear-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              광주광역시교육청AI교육원
            </h1>
            <p className="mt-1 text-sm font-semibold text-violet-400">
              Your Digital Identity is ready.
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-6" style={{ perspective: '1000px' }}>
          <AvatarGrid avatars={allAvatars} />
        </main>

        <aside className="flex-none w-72 border-l border-gray-100 px-6 py-8 flex flex-col gap-8">
          <div>
            <p className="text-xs font-black tracking-widest text-violet-400 uppercase mb-3">
              Live Statistics
            </p>
            <motion.p
              key={allAvatars.length}
              className="text-7xl font-black text-violet-500 leading-none"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {allAvatars.length}
            </motion.p>
            <p className="mt-2 text-sm font-semibold text-gray-400">Total AI Avatars</p>
          </div>

          <div>
            <p className="text-xs font-black tracking-widest text-violet-400 uppercase mb-4">
              How to Participate
            </p>
            <div className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm">
              <QRCodeSVG value={PARTICIPATE_URL} size={160} />
              <p className="text-xs text-gray-400 font-semibold">{window.location.host}/create</p>
            </div>
            <p className="mt-4 text-base font-black text-gray-800 text-center">QR 스캔하기</p>
            <p className="mt-1 text-xs text-gray-400 text-center leading-5">
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
