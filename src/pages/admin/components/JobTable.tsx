import { useEffect, useRef, useState } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import type { GenerationStatus } from '@/shared/api'

export type AdminJob = {
  id: number
  dbId?: number
  aikon: string
  nickname: string
  style: string
  profile: string
  status: string
  generationStatus?: GenerationStatus
  createdAt?: string
}

type FilterOption = { label: string; value: GenerationStatus | 'ALL' }

const FILTER_OPTIONS: FilterOption[] = [
  { label: '전체', value: 'ALL' },
  { label: '대기중', value: 'WAITING' },
  { label: '처리중', value: 'PROCESSING' },
  { label: '재시도중', value: 'RETRYING' },
  { label: '완료', value: 'COMPLETED' },
  { label: '실패', value: 'FAILED' },
]

type JobTableProps = {
  jobs: AdminJob[]
  isRefreshing: boolean
  onRefresh: () => void
  onDelete: (jobId: number) => void
}

export default function JobTable({ jobs, isRefreshing, onRefresh, onDelete }: JobTableProps) {
  const [filter, setFilter] = useState<GenerationStatus | 'ALL'>('ALL')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = filter === 'ALL' ? jobs : jobs.filter((j) => j.generationStatus === filter)

  const currentLabel = FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? '전체'

  return (
    <section className="mt-6 overflow-hidden rounded-xl border-2 border-[#EDE2FF] bg-white">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-5">
        <h2 className="text-sm font-black text-slate-600">작업 목록</h2>
        <div className="flex items-center gap-2">
          <div ref={dropdownRef} className="relative w-24">
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition-colors hover:border-violet-200 hover:text-violet-500"
              aria-label="작업 상태 필터"
            >
              {currentLabel}
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-10 z-20 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFilter(opt.value)
                      setIsOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left text-xs font-bold transition-colors hover:bg-violet-50 hover:text-violet-600 ${
                      filter === opt.value ? 'bg-violet-50 text-violet-600' : 'text-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-violet-200 hover:text-violet-500 disabled:opacity-50"
            aria-label="작업 목록 새로고침"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-h-75 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-75 items-center justify-center text-sm font-bold text-slate-400">
            {filter === 'ALL' ? '작업이 없습니다' : `${currentLabel} 항목이 없습니다`}
          </div>
        ) : (
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[22%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="h-10 bg-slate-50 text-xs font-black text-slate-500">
                <th className="px-4 align-middle sm:px-5">AIKON</th>
                <th className="px-4 align-middle">닉네임</th>
                <th className="px-4 align-middle">스타일</th>
                <th className="px-4 align-middle">성별/나이</th>
                <th className="px-4 align-middle">상태</th>
                <th className="px-4 align-middle">시간</th>
                <th className="px-4 align-middle">
                  <span className="sr-only">관리</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="h-13 text-sm font-bold text-slate-500">
                  <td className="px-4 align-middle font-black text-violet-500 sm:px-5">
                    {job.aikon}
                  </td>
                  <td className="px-4 align-middle">{job.nickname}</td>
                  <td className="px-4 align-middle">{job.style}</td>
                  <td className="px-4 align-middle">{job.profile}</td>
                  <td className="px-4 align-middle">{job.status}</td>
                  <td className="px-4 align-middle">{job.createdAt ?? '-'}</td>
                  <td className="px-4 align-middle">
                    {job.dbId !== undefined ? (
                      <button
                        type="button"
                        onClick={() => onDelete(job.dbId!)}
                        className="text-sm font-black text-rose-500 transition-colors hover:text-rose-600"
                      >
                        삭제
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
