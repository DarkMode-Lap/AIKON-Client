import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-dvh bg-white flex flex-col px-6 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <p className="fade-in text-xs font-bold text-violet-500 tracking-widest uppercase mb-3">
          광주AI교육원
        </p>
        <h1 className="fade-in-1 text-5xl font-black text-gray-900 tracking-tight mb-3">Aikon</h1>
        <p className="fade-in-2 text-sm text-gray-400">나만의 AI 캐릭터를 만들어보세요</p>
      </div>

      <div className="relative z-10 w-full pb-safe">
        <motion.button
          className="fade-in-3 btn-magic w-full py-4 text-white text-base font-bold"
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/create')}
        >
          캐릭터 만들기
        </motion.button>
      </div>
    </div>
  )
}
