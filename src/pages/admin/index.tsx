import { useEffect, useRef, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import {
  checkHealth,
  deleteAvatar,
  deleteAllAvatars,
  subscribeToAvatarChanges,
  updateAvatar,
  type AvatarListItem,
  type AvatarGender,
  type AvatarAgeRange,
} from '@/shared/api'
import ConfirmModal from './components/ConfirmModal'
import EditAvatarModal from './components/EditAvatarModal'
import JobTable, { type AdminJob } from './components/JobTable'

const STYLE_LABELS: Record<string, string> = {
  STUDIO: '스튜디오',
  GHIBLI: '지브리풍',
  DISNEY_PIXAR: '디즈니픽사',
  TRADITIONAL_HANBOK: '한복',
  ZOOTOPIA: '주토피아',
  LIGHT_ART: '라이트아트',
}

const GENDER_LABELS: Record<string, string> = { MALE: '남자', FEMALE: '여자' }

const AGE_LABELS: Record<string, string> = {
  AGE_0_7: '0~7',
  AGE_8_13: '8~13',
  AGE_14_19: '14~19',
  AGE_20_PLUS: '20+',
}

const STATUS_LABELS: Record<string, string> = {
  WAITING: '대기중',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  FAILED: '실패',
  RETRYING: '재시도중',
}

function formatCreatedAt(raw?: string): string {
  if (!raw) return '-'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function toAdminJob(avatar: AvatarListItem, index: number): AdminJob {
  const gender = avatar.gender ? (GENDER_LABELS[avatar.gender] ?? avatar.gender) : '-'
  const age = avatar.ageRange ? (AGE_LABELS[avatar.ageRange] ?? avatar.ageRange) : '-'
  return {
    id: index,
    dbId: avatar.id,
    aikon: avatar.passUrl ?? '-',
    nickname: avatar.nickname,
    style: avatar.style ? (STYLE_LABELS[avatar.style] ?? avatar.style) : '-',
    profile: `${gender}/${age}`,
    status: avatar.generationStatus
      ? (STATUS_LABELS[avatar.generationStatus] ?? avatar.generationStatus)
      : '-',
    generationStatus: avatar.generationStatus,
    rawGender: avatar.gender,
    rawAgeRange: avatar.ageRange,
    createdAt: formatCreatedAt(avatar.createdAt),
  }
}

export default function AdminPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [systemOk, setSystemOk] = useState<boolean | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null)
  const [editJob, setEditJob] = useState<AdminJob | null>(null)
  const unsubRef = useRef<(() => void) | null>(null)
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    checkHealth()
      .then(() => setSystemOk(true))
      .catch(() => setSystemOk(false))

    unsubRef.current = subscribeToAvatarChanges((avatars) => {
      setJobs(avatars.map((avatar, index) => toAdminJob(avatar, index)))
    })

    return () => {
      unsubRef.current?.()
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    }
  }, [])

  function handleRefresh() {
    let active = true
    setIsRefreshing(true)
    unsubRef.current?.()

    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    refreshTimeoutRef.current = setTimeout(() => {
      active = false
      setIsRefreshing(false)
      toast.error('새로고침에 실패했습니다')
    }, 5000)

    unsubRef.current = subscribeToAvatarChanges((avatars) => {
      if (active) {
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
        setIsRefreshing(false)
        toast.success('목록을 새로고침했습니다')
        active = false
      }
      setJobs(avatars.map((avatar, index) => toAdminJob(avatar, index)))
    })
  }

  async function handleResetConfirm() {
    try {
      await deleteAllAvatars()
      setJobs([])
      toast.success('전체 초기화되었습니다')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류'
      toast.error(`초기화 실패: ${msg}`)
    } finally {
      setIsResetModalOpen(false)
    }
  }

  async function handleDeleteConfirm() {
    if (deleteJobId === null) return
    try {
      await deleteAvatar(deleteJobId)
      setJobs((prev) => prev.filter((j) => j.dbId !== deleteJobId))
      toast.success('삭제되었습니다')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류'
      toast.error(`삭제 실패: ${msg}`)
    } finally {
      setDeleteJobId(null)
    }
  }

  async function handleEditConfirm(data: {
    nickname: string
    gender?: AvatarGender
    ageRange?: AvatarAgeRange
  }) {
    if (editJob?.dbId === undefined) return
    try {
      await updateAvatar(editJob.dbId, data)
      setJobs((prev) =>
        prev.map((j) => {
          if (j.dbId !== editJob.dbId) return j
          const genderLabel = data.gender ? (GENDER_LABELS[data.gender] ?? data.gender) : '-'
          const ageLabel = data.ageRange ? (AGE_LABELS[data.ageRange] ?? data.ageRange) : '-'
          return {
            ...j,
            nickname: data.nickname,
            rawGender: data.gender,
            rawAgeRange: data.ageRange,
            profile: `${genderLabel}/${ageLabel}`,
          }
        }),
      )
      toast.success('수정되었습니다')
      setEditJob(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류'
      toast.error(`수정 실패: ${msg}`)
      throw e
    }
  }

  const waitingCount = jobs.filter((j) => j.generationStatus === 'WAITING').length

  return (
    <main className="min-h-dvh overflow-hidden bg-[#fdfcff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(196,181,253,0.38),transparent_28%),radial-gradient(circle_at_100%_100%,rgba(251,207,232,0.48),transparent_30%)]" />

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-210 flex-col px-5 py-14 sm:py-14.5">
        <AdminHeader systemOk={systemOk} />
        <SummarySection totalJobs={jobs.length} waitingCount={waitingCount} />
        <JobTable
          jobs={jobs}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onDelete={setDeleteJobId}
          onEdit={setEditJob}
        />
        <DangerZone onReset={() => setIsResetModalOpen(true)} />
      </section>

      {isResetModalOpen && (
        <ConfirmModal
          title="정말 초기화 할까요?"
          description="모든 아바타 데이터가 삭제됩니다"
          primaryLabel="초기화"
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={handleResetConfirm}
        />
      )}
      {deleteJobId !== null && (
        <ConfirmModal
          title="정말 삭제 할까요?"
          description="선택한 아바타 데이터가 삭제됩니다"
          primaryLabel="삭제"
          onClose={() => setDeleteJobId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {editJob !== null && (
        <EditAvatarModal
          initialNickname={editJob.nickname}
          initialGender={editJob.rawGender}
          initialAgeRange={editJob.rawAgeRange}
          onClose={() => setEditJob(null)}
          onConfirm={handleEditConfirm}
        />
      )}
    </main>
  )
}

function AdminHeader({ systemOk }: { systemOk: boolean | null }) {
  const isUnknown = systemOk === null
  const badgeClass = isUnknown
    ? 'border-slate-200 bg-slate-50 text-slate-400'
    : systemOk
      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
      : 'border-rose-200 bg-rose-50 text-rose-600'
  const dotClass = isUnknown ? 'bg-slate-300' : systemOk ? 'bg-emerald-300' : 'bg-rose-400'
  const label = isUnknown ? '확인 중' : systemOk ? '시스템 정상' : '시스템 오류'

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

      <div
        className={`inline-flex h-7 w-fit items-center gap-2 rounded-full border px-3.5 text-xs font-black ${badgeClass}`}
      >
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        {label}
      </div>
    </header>
  )
}

function SummarySection({ totalJobs, waitingCount }: { totalJobs: number; waitingCount: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SummaryCard title="전체 아바타">
        <div className="mt-5.5 flex items-end gap-1.5">
          <strong className="text-[32px] leading-none font-black text-slate-950">
            {totalJobs}
          </strong>
          <span className="pb-1 text-xl font-black text-slate-500">건</span>
        </div>
      </SummaryCard>

      <SummaryCard title="대기 큐">
        <div className="mt-5.5 flex items-end gap-2">
          <strong className="text-[32px] leading-none font-black text-slate-950">
            {waitingCount}
          </strong>
          <span className="pb-1 text-xl font-black text-slate-600">건 대기 중</span>
        </div>
      </SummaryCard>
    </div>
  )
}

function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="min-h-33 rounded-[10px] border-2 border-violet-100 bg-white/80 p-4 backdrop-blur sm:p-5">
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
        className="mt-4 h-10 w-full max-w-60 rounded-[10px] bg-rose-500 text-sm font-black text-white transition-colors hover:bg-rose-600"
      >
        시스템 데이터 전체 초기화
      </button>
    </section>
  )
}
