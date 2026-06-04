import { useState, type ReactNode } from 'react'
import ConfirmModal from './components/ConfirmModal'
import JobTable, { type AdminJob } from './components/JobTable'

const jobs: AdminJob[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  aikon: 'Akikon555',
  nickname: '별빛전사',
  style: '지브리풍',
  profile: '남자/8~13',
  status: '완료',
  createdAt: '2026-5-19 15:32',
}))

export default function AdminPage() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null)

  return (
    <main className="min-h-dvh overflow-hidden bg-[#fdfcff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(196,181,253,0.38),transparent_28%),radial-gradient(circle_at_100%_100%,rgba(251,207,232,0.48),transparent_30%)]" />

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[840px] flex-col px-5 py-14 sm:py-[58px]">
        <AdminHeader />
        <SummarySection />
        <JobTable jobs={jobs} onDelete={setDeleteJobId} />
        <DangerZone onReset={() => setIsResetModalOpen(true)} />
      </section>

      {isResetModalOpen && (
        <ConfirmModal
          title="정말 초기화 할까요?"
          description="모든 아바타 데이터가 삭제됩니다"
          primaryLabel="초기화"
          onClose={() => setIsResetModalOpen(false)}
        />
      )}
      {deleteJobId !== null && (
        <ConfirmModal
          title="정말 삭제 할까요?"
          description="선택한 아바타 데이터가 삭제됩니다"
          primaryLabel="삭제"
          onClose={() => setDeleteJobId(null)}
        />
      )}
    </main>
  )
}

function AdminHeader() {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[28px] leading-9 font-black tracking-normal text-slate-950 sm:text-[30px]">
          관리자 대시보드
        </h1>
        <p className="mt-1.5 text-sm leading-5 font-semibold text-slate-500">
          AI PASS 발급 시스템 관리
        </p>
      </div>

      <div className="inline-flex h-7 w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 text-xs font-black text-emerald-600">
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
        시스템 정상
      </div>
    </header>
  )
}

function SummarySection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SummaryCard title="API WORKER">
        <div className="mt-[22px] flex items-end gap-1.5">
          <strong className="text-[32px] leading-none font-black text-slate-950">3</strong>
          <span className="pb-1 text-xl font-black text-slate-500">/12 활성</span>
        </div>
        <div className="mt-[22px] h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-[28%] rounded-full bg-violet-500" />
        </div>
      </SummaryCard>

      <SummaryCard title="대기 큐">
        <div className="mt-[22px] flex items-end gap-2">
          <strong className="text-[32px] leading-none font-black text-slate-950">8</strong>
          <span className="pb-1 text-xl font-black text-slate-600">건 대기 중</span>
        </div>
        <p className="mt-3 text-sm font-bold text-slate-400">예상 처리 시간 : 320초</p>
      </SummaryCard>
    </div>
  )
}

function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="min-h-[132px] rounded-[10px] border-2 border-violet-100 bg-white/80 p-4 backdrop-blur sm:p-5">
      <h2 className="text-sm font-black text-slate-500">{title}</h2>
      {children}
    </article>
  )
}

function DangerZone({ onReset }: { onReset: () => void }) {
  return (
    <section className="mt-6 rounded-[10px] border-2 border-rose-500 bg-white/70 px-4 py-4 sm:px-5">
      <h2 className="text-sm font-black text-rose-500">위험 구역</h2>
      <p className="mt-2 text-xs leading-4 font-semibold text-slate-400">
        시스템 전체 데이터를 초기화합니다. 되돌릴 수 없어요!
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 h-10 w-full max-w-[240px] rounded-[10px] bg-rose-500 text-sm font-black text-white transition-colors hover:bg-rose-600"
      >
        시스템 데이터 전체 초기화
      </button>
    </section>
  )
}
