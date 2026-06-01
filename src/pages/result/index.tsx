import { useNavigate, useSearchParams, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Share2, RefreshCw } from 'lucide-react'
import { STYLE_OPTIONS, AIKON_RANGE } from '@/shared/lib/constants'
import toast from 'react-hot-toast'

function AvatarPlaceholder({ style, nickname }: { style: string; nickname: string }) {
  const styleInfo = STYLE_OPTIONS.find((s) => s.id === style)
  return (
    <div
      className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center bg-linear-to-br ${styleInfo?.gradient ?? 'from-violet-500 to-purple-700'}`}
    >
      <div className="text-7xl mb-3">{styleInfo?.emoji ?? '🌟'}</div>
      <p className="text-white font-black text-xl">{nickname}</p>
      <p className="text-white/70 text-sm mt-1">{styleInfo?.label ?? ''} 캐릭터</p>
    </div>
  )
}

function toAikonNumber(id: string): number {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AIKON_RANGE.min + (hash % (AIKON_RANGE.max - AIKON_RANGE.min + 1))
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const nickname = params.get('nickname') ?? '친구'
  const style = params.get('style') ?? 'ghibli'
  const imageUrl = params.get('imageUrl') ?? ''
  function handleDownload() {
    if (!imageUrl) {
      toast('이미지 저장 기능은 백엔드 연결 후 활성화돼요 📁')
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
        URL.revokeObjectURL(url)
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
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success('링크가 복사됐어요! 📋'))
        .catch(() => toast.error('링크 복사에 실패했어요. 😢'))
    }
  }

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

      <div className="fade-in relative z-10 w-full max-w-sm text-center mb-4">
        <h1 className="text-2xl font-black text-gray-900">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 to-pink-500">
            {nickname}님
          </span>
          의 아바타
        </h1>
      </div>

      <div className="fade-in-1 relative z-10 w-full max-w-sm space-y-4">
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${nickname}의 아바타`}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <AvatarPlaceholder style={style} nickname={nickname} />
          )}
        </div>

        <div className="glass-card p-5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 to-pink-500 font-black text-lg">
              Aikon
            </span>
            <span className="text-gray-400 font-bold text-sm">#{toAikonNumber(id ?? '')}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100">
            <QRCodeSVG
              value={`${window.location.origin}/result/${id}?nickname=${encodeURIComponent(nickname)}&style=${style}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}`}
              size={140}
              bgColor="#ffffff"
              fgColor="#1e0f3f"
              level="M"
            />
          </div>
          <p className="text-xs text-gray-400 text-center">
            QR코드를 체험 기기에 스캔해서 사용하세요 📱
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="py-3.5 rounded-xl border-2 border-violet-200 bg-white text-violet-600 hover:bg-violet-50 transition-all text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            저장하기
          </button>
          <button
            onClick={handleShare}
            className="py-3.5 rounded-xl border-2 border-violet-200 bg-white text-violet-600 hover:bg-violet-50 transition-all text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            공유하기
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-magic w-full py-4 text-white text-base font-bold flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          새로운 아바타 만들기
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          © 광주AI교육원 · AI PASS 발급 시스템
        </p>
      </div>
    </div>
  )
}
