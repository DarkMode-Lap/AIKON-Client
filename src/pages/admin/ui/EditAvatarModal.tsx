import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
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

const GENDER_OPTIONS: { value: AvatarGender; label: string }[] = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="edit-modal-title" className="text-base font-black text-slate-900">
            아바타 수정
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-5">
          {/* Nickname */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              placeholder="닉네임 입력"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">성별</label>
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGender(opt.value)}
                  className={`h-9 flex-1 rounded-lg text-sm font-bold transition-all ${
                    gender === opt.value
                      ? 'border border-slate-200 bg-white text-violet-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">나이대</label>
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {AGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAgeRange(opt.value)}
                  className={`h-9 flex-1 rounded-lg text-sm font-bold transition-all ${
                    ageRange === opt.value
                      ? 'border border-slate-200 bg-white text-violet-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 flex-1 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="h-10 flex-1 rounded-xl bg-violet-500 text-sm font-bold text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? '저장 중…' : '저장'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
