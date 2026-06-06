import { motion } from 'framer-motion'
import type { AvatarListItem } from '@/shared/api'

const SPARKLES = ['⭐', '🌟', '✨', '💫']

function cardParams(i: number) {
  const duration = 4 + (i % 5)
  const delay = (i * 0.55) % 4
  const rx = [0, 4 + (i % 3) * 2, 0, -(4 + (i % 3) * 2), 0]
  const ry = [0, -(6 + (i % 4) * 2), 0, 6 + (i % 4) * 2, 0]
  const y = [0, -(5 + (i % 3) * 2), 0, 5 + (i % 3) * 2, 0]
  return { duration, delay, rx, ry, y }
}

interface AvatarCardProps {
  avatar: AvatarListItem
  index: number
}

export function AvatarCard({ avatar, index }: AvatarCardProps) {
  const { duration, delay, rx, ry, y } = cardParams(index)
  const sparkle = SPARKLES[index % SPARKLES.length]

  return (
    <motion.div
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{ opacity: 1, scale: 1, rotateX: rx, rotateY: ry, y }}
      transition={{
        opacity: { duration: 0.3, delay: index * 0.06 },
        scale: { type: 'spring', stiffness: 280, damping: 16, delay: index * 0.06 },
        rotateX: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
        rotateY: { duration: duration * 1.1, delay, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: duration * 0.9, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="relative rounded-3xl bg-white p-3 flex flex-col items-center gap-3"
      style={{ boxShadow: '0 8px 32px rgba(139,92,246,0.18), 0 2px 8px rgba(0,0,0,0.05)' }}
    >
      <motion.span
        className="absolute -top-3 -right-2 text-2xl pointer-events-none select-none"
        animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.25, 0.9, 1] }}
        transition={{ duration: 2.5 + (index % 3) * 0.5, repeat: Infinity, delay: index * 0.3, ease: 'easeInOut' }}
      >
        {sparkle}
      </motion.span>

      <div
        className="w-full aspect-square rounded-2xl overflow-hidden"
        style={{ transform: 'translateZ(20px)', boxShadow: '0 4px 20px rgba(139,92,246,0.28)' }}
      >
        <img src={avatar.imageUrl} alt={avatar.nickname} className="w-full h-full object-cover" />
      </div>

      <p
        className="text-lg font-black text-violet-700 text-center leading-tight"
        style={{ transform: 'translateZ(10px)' }}
      >
        {avatar.nickname}
      </p>
    </motion.div>
  )
}
