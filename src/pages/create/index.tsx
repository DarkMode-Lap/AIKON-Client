import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowLeft, ArrowRight, Camera, RefreshCw, Check, X } from 'lucide-react'
import { STYLE_OPTIONS, AGE_GROUPS, GENDER_OPTIONS } from '@/shared/lib/constants'
import { cn, randomNickname } from '@/shared/lib/utils'
import type { CreateFormData, AvatarStyle, AgeGroup, Gender } from '@/entities/avatar'
import { compressImage } from '@/shared/lib/compressImage'
import toast from 'react-hot-toast'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const TOTAL_STEPS = 4

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 16 : -16, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -16 : 16, opacity: 0 }),
}

export default function CreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<CreateFormData>({
    nickname: '',
    style: null,
    ageGroup: null,
    gender: null,
    photoFile: null,
    photoPreview: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  useEffect(() => {
    return () => {
      if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
    }
  }, [form.photoPreview])

  function canProceed(): boolean {
    if (step === 1) return form.nickname.trim().length >= 2
    if (step === 2) return form.style !== null
    if (step === 3) return form.ageGroup !== null && form.gender !== null
    if (step === 4) return form.photoPreview !== null
    return true
  }

  function goNext() {
    if (!canProceed()) return
    if (step === TOTAL_STEPS) {
      handleGenerate()
      return
    }
    setDir(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    if (step === 1) {
      navigate('/')
      return
    }
    setDir(-1)
    setStep((s) => s - 1)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있어요! 😢')
      return
    }
    // 즉시 미리보기 표시
    const previewUrl = URL.createObjectURL(file)
    setForm((f) => ({ ...f, photoFile: file, photoPreview: previewUrl }))
    setIsCompressing(true)
    try {
      const compressed = await compressImage(file)
      setForm((f) => ({ ...f, photoFile: compressed }))
    } catch {
      // 압축 실패 시 원본 그대로 사용
    } finally {
      setIsCompressing(false)
    }
    toast.success('사진이 선택됐어요! 🖼️')
  }

  function handleGenerate() {
    if (!form.photoFile || !form.style || !form.gender || !form.ageGroup) return
    navigate('/loading', {
      state: {
        image: form.photoFile,
        nickname: form.nickname,
        gender: form.gender,
        style: form.style,
        ageRange: form.ageGroup,
      },
    })
  }

  return (
    <div className="relative min-h-dvh bg-white flex flex-col items-center px-4 py-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-300 blur-3xl opacity-60"
          animate={{ x: [0, -70, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-pink-300 blur-3xl opacity-60"
          animate={{ x: [0, 70, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="fade-in relative z-10 w-full max-w-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-violet-500 hover:text-violet-700 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? '처음으로' : '이전'}
          </button>
          <span className="text-xs text-gray-400 font-semibold">
            {step} / {TOTAL_STEPS}
          </span>
        </div>

        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-500',
                i + 1 < step ? 'bg-violet-500' : i + 1 === step ? 'bg-violet-400' : 'bg-gray-200',
              )}
            />
          ))}
        </div>
      </div>

      <div className="fade-in-1 relative z-10 w-full max-w-md flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: EASE }}
            className="flex-1 flex flex-col"
          >
            {step === 1 && (
              <StepNickname
                nickname={form.nickname}
                onChange={(nickname) => setForm((f) => ({ ...f, nickname }))}
                onRandom={() => setForm((f) => ({ ...f, nickname: randomNickname() }))}
              />
            )}
            {step === 2 && (
              <StepStyle
                selected={form.style}
                onSelect={(style: AvatarStyle) => setForm((f) => ({ ...f, style }))}
              />
            )}
            {step === 3 && (
              <StepDemographic
                ageGroup={form.ageGroup}
                gender={form.gender}
                onAgeGroup={(ageGroup: AgeGroup) => setForm((f) => ({ ...f, ageGroup }))}
                onGender={(gender: Gender) => setForm((f) => ({ ...f, gender }))}
              />
            )}
            {step === 4 && (
              <StepPhoto
                preview={form.photoPreview}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onReset={() => {
                  setForm((f) => ({ ...f, photoPreview: null, photoFile: null }))
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fade-in-2 relative z-10 w-full max-w-md mt-4">
        <button
          onClick={goNext}
          disabled={!canProceed() || isCompressing}
          className={cn(
            'btn-magic w-full py-4 text-white text-base flex items-center justify-center gap-2 transition-opacity',
            (!canProceed() || isCompressing) && 'opacity-40 cursor-not-allowed',
          )}
        >
          {step === TOTAL_STEPS ? (
            <>
              <Sparkles className="w-5 h-5" />
              {isCompressing ? '사진 처리 중...' : 'AI 캐릭터 만들기!'}
              <Sparkles className="w-5 h-5" />
            </>
          ) : (
            <>
              다음 단계
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function StepNickname({
  nickname,
  onChange,
  onRandom,
}: {
  nickname: string
  onChange: (v: string) => void
  onRandom: () => void
}) {
  return (
    <div className="glass-card p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">닉네임을 정해요!</h2>
        <p className="text-sm text-gray-500">나를 표현하는 멋진 이름을 만들어보세요 ✨</p>
      </div>

      <div className="relative">
        <input
          type="text"
          value={nickname}
          onChange={(e) => onChange(e.target.value)}
          maxLength={12}
          placeholder="닉네임 입력 (2~12자)"
          className="w-full rounded-xl px-4 py-4 bg-gray-50 border-2 border-gray-200 text-gray-900 text-lg font-black placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-all text-center"
          autoFocus
          autoComplete="off"
        />
        {nickname && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-right text-xs text-gray-400">{nickname.length} / 12</div>

      <button
        onClick={onRandom}
        className="w-full py-3.5 rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-600 flex items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-100 transition-all text-sm font-bold"
      >
        <RefreshCw className="w-4 h-4" />
        랜덤 닉네임 뽑기 🎲
      </button>
    </div>
  )
}

function StepStyle({
  selected,
  onSelect,
}: {
  selected: AvatarStyle | null
  onSelect: (s: AvatarStyle) => void
}) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">스타일을 골라요!</h2>
        <p className="text-sm text-gray-500">어떤 느낌의 캐릭터로 만들까요? 🎨</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STYLE_OPTIONS.map((style) => (
          <motion.button
            key={style.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(style.id)}
            className={cn(
              'relative rounded-2xl p-4 text-left border-2 transition-all overflow-hidden',
              selected === style.id
                ? 'border-violet-500'
                : 'border-gray-200 hover:border-violet-300',
            )}
          >
            <div
              className={cn(
                'absolute -top-5 -right-5 w-24 h-24 rounded-full blur-xl opacity-35 bg-linear-to-br',
                style.gradient,
              )}
            />
            {selected === style.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="relative">
              <div className="text-3xl mb-2">{style.emoji}</div>
              <div
                className={cn(
                  'font-black text-sm',
                  selected === style.id ? 'text-violet-700' : 'text-gray-800',
                )}
              >
                {style.label}
              </div>
              <div className="text-gray-500 text-xs mt-0.5 whitespace-pre-line leading-tight">
                {style.description}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function StepDemographic({
  ageGroup,
  gender,
  onAgeGroup,
  onGender,
}: {
  ageGroup: AgeGroup | null
  gender: Gender | null
  onAgeGroup: (v: AgeGroup) => void
  onGender: (v: Gender) => void
}) {
  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">나에 대해 알려줘요!</h2>
        <p className="text-sm text-gray-500">더 예쁜 캐릭터를 만드는 데 도움이 돼요 🌟</p>
      </div>

      <div>
        <p className="text-sm font-black text-gray-700 mb-3">성별</p>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => onGender(g.value as Gender)}
              className={cn(
                'flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1.5',
                gender === g.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-violet-300',
              )}
            >
              <span className="text-3xl">{g.emoji}</span>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-black text-gray-700 mb-3">나이대</p>
        <div className="grid grid-cols-2 gap-3">
          {AGE_GROUPS.map((a) => (
            <button
              key={a.value}
              onClick={() => onAgeGroup(a.value as AgeGroup)}
              className={cn(
                'py-3.5 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1',
                ageGroup === a.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-violet-300',
              )}
            >
              <span className="text-2xl">{a.emoji}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepPhoto({
  preview,
  fileInputRef,
  onFileChange,
  onReset,
}: {
  preview: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
}) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">사진을 찍어요!</h2>
        <p className="text-sm text-gray-500">얼굴이 잘 보이도록 찍어주세요 📸</p>
      </div>

      {preview ? (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-violet-400">
            <img src={preview} alt="preview" className="w-full aspect-square object-cover" />
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 선택 완료!
              </span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            다시 선택하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 hover:border-violet-400 hover:bg-violet-100 transition-all flex flex-col items-center justify-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="font-black text-base text-violet-700">사진등록</p>
              <p className="text-sm text-violet-400 mt-0.5">촬영 / 갤러리</p>
            </div>
          </button>
          <p className="text-center text-xs text-gray-400">얼굴이 잘 나온 사진을 선택해주세요 😊</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      )}
    </div>
  )
}
