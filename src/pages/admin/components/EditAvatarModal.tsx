import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AvatarGender, AvatarAgeRange } from '@/shared/api'

type EditData = {
  nickname: string
  gender?: AvatarGender
  ageRange?: AvatarAgeRange
}

type EditAvatarModalProps = {
  initialNickname: string
  initialGender?: AvatarGender
  initialAgeRange?: AvatarAgeRange
  onClose: () => void
  onConfirm: (data: EditData) => Promise<void>
}

const GENDER_OPTIONS: { value: AvatarGender; label: string; emoji: string }[] = [
  { value: 'MALE', label: '남자', emoji: '👦' },
  { value: 'FEMALE', label: '여자', emoji: '👧' },
]

const AGE_OPTIONS: { value: AvatarAgeRange; label: string }[] = [
  { value: 'AGE_0_7', label: '0~7' },
  { value: 'AGE_8_13', label: '8~13' },
  { value: 'AGE_14_19', label: '14~19' },
  { value: 'AGE_20_PLUS', label: '20+' },
]

export default function EditAvatarModal({
  initialNickname,
  initialGender,
  initialAgeRange,
  onClose,
  onConfirm,
}: EditAvatarModalProps) {
  const [nickname, setNickname] = useState(initialNickname)
  const [gender, setGender] = useState<AvatarGender | undefined>(initialGender)
  const [ageRange, setAgeRange] = useState<AvatarAgeRange | undefined>(initialAgeRange)
  const [isSaving, setIsSaving] = useState(false)

  const canSave = nickname.trim().length >= 2

  async function handleSave() {
    if (!canSave || isSaving) return
    setIsSaving(true)
    try {
      await onConfirm({ nickname: nickname.trim(), gender, ageRange })
    } catch {
      // parent handles toast; keep modal open
    } finally {
      setIsSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className="relative w-full max-w-[480px] rounded-t-[24px] bg-white px-6 pb-8 pt-6 shadow-xl sm:rounded-[20px] sm:px-8 sm:pb-8 sm:pt-7"
      >
        {/* Drag handle (mobile) */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />

        {/* Header */}
        <div className="mb-7">
          <h2
            id="edit-modal-title"
            className="text-[22px] leading-8 font-black text-slate-950 sm:text-[24px]"
          >
            아바타 수정
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">
            이름, 성별, 나이대를 변경할 수 있어요
          </p>
        </div>

        {/* Nickname */}
        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-black tracking-widest text-slate-400 uppercase">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            autoFocus
            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            placeholder="닉네임 입력 (2자 이상)"
          />
        </div>

        {/* Gender */}
        <div className="mb-5">
          <label className="mb-2 block text-[11px] font-black tracking-widest text-slate-400 uppercase">
            성별
          </label>
          <div className="grid grid-cols-2 gap-3">
            {GENDER_OPTIONS.map((opt) => {
              const active = gender === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(active ? undefined : opt.value)}
                  className={`relative h-12 rounded-2xl text-sm font-black transition-all duration-200 ${
                    active
                      ? 'bg-violet-500 text-white'
                      : 'border-2 border-slate-100 bg-slate-50 text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-500'
                  }`}
                >
                  <span className="mr-1.5">{opt.emoji}</span>
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Age Range */}
        <div className="mb-8">
          <label className="mb-2 block text-[11px] font-black tracking-widest text-slate-400 uppercase">
            나이대
          </label>
          <div className="grid grid-cols-4 gap-2">
            {AGE_OPTIONS.map((opt) => {
              const active = ageRange === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAgeRange(active ? undefined : opt.value)}
                  className={`h-11 rounded-2xl text-sm font-black transition-all duration-200 ${
                    active
                      ? 'bg-violet-500 text-white'
                      : 'border-2 border-slate-100 bg-slate-50 text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-500'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-12 rounded-2xl border-2 border-slate-100 bg-white text-base font-black text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="h-12 rounded-2xl bg-violet-500 text-base font-black text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? '저장 중…' : '저장'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
