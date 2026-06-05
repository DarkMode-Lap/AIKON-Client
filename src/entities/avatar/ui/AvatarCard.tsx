import { motion } from 'framer-motion'
import type { AvatarListItem } from '@/shared/api'

function cardParams(i: number) {
  const duration = 4 + (i % 5)
  const delay    = (i * 0.55) % 4
  const rx       = [0,  4 + (i % 3) * 2, 0, -(4 + (i % 3) * 2), 0]
  const ry       = [0, -(6 + (i % 4) * 2), 0,  6 + (i % 4) * 2, 0]
  const y        = [0, -(5 + (i % 3) * 2), 0,  5 + (i % 3) * 2, 0]
  return { duration, delay, rx, ry, y }
}

interface AvatarCardProps {
  avatar: AvatarListItem
  index: number
}

export function AvatarCard({ avatar, index }: AvatarCardProps) {
  const { duration, delay, rx, ry, y } = cardParams(index)

  return (
    <motion.div
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateX: rx,
        rotateY: ry,
        y,
      }}
      transition={{
        opacity: { duration: 0.4, delay: index * 0.05 },
        scale:   { duration: 0.4, delay: index * 0.05 },
        rotateX: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
        rotateY: { duration: duration * 1.1, delay, repeat: Infinity, ease: 'easeInOut' },
        y:       { duration: duration * 0.9, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-md"
    >
      <div
        className="w-full aspect-square rounded-xl overflow-hidden shadow-lg"
        style={{ transform: 'translateZ(20px)' }}
      >
        <img src={avatar.imageUrl} alt={avatar.nickname} className="w-full h-full object-cover" />
      </div>
      <p className="text-xl font-black text-gray-800" style={{ transform: 'translateZ(10px)' }}>
        {avatar.nickname}
      </p>
    </motion.div>
  )
}
