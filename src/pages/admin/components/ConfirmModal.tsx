type ConfirmModalProps = {
  title: string
  description: string
  primaryLabel: string
  onClose: () => void
  onConfirm?: () => void
}

export default function ConfirmModal({
  title,
  description,
  primaryLabel,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  function handleConfirm() {
    onConfirm?.()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-[460px] rounded-[8px] bg-white px-8 pb-8 pt-7 shadow-[0_20px_64px_rgba(15,23,42,0.22)]">
        <h2 id="confirm-modal-title" className="text-[24px] leading-8 font-black text-slate-950">
          {title}
        </h2>
        <p className="mt-2.5 text-lg leading-7 font-black text-slate-500">{description}</p>

        <div className="mt-9 grid grid-cols-2 gap-5">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-[14px] border-2 border-[#E8E8E8] bg-white text-base font-black text-slate-500 transition-colors hover:bg-slate-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-12 rounded-[14px] bg-rose-500 text-base font-black text-white transition-colors hover:bg-rose-600"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
