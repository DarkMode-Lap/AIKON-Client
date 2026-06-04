import { ChevronDown, RefreshCw } from 'lucide-react'

export type AdminJob = {
  id: number
  aikon: string
  nickname: string
  style: string
  profile: string
  status: string
  createdAt: string
}

type JobTableProps = {
  jobs: AdminJob[]
  onDelete: (jobId: number) => void
}

export default function JobTable({ jobs, onDelete }: JobTableProps) {
  return (
    <section className="mt-6 h-[365px] overflow-hidden rounded-[12px] border-2 border-[#EDE2FF] bg-white">
      <div className="flex h-[64px] items-center justify-between gap-3 px-4 sm:px-5">
        <h2 className="text-sm font-black text-slate-600">작업 목록</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-5 rounded-[8px] border-2 border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition-colors hover:border-violet-200 hover:text-violet-500"
            aria-label="작업 상태 필터"
          >
            전체
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white text-slate-400 transition-colors hover:border-violet-200 hover:text-violet-500"
            aria-label="작업 목록 새로고침"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
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
          <thead>
            <tr className="h-10 bg-slate-50/80 text-xs font-black text-slate-500">
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
            {jobs.map((job) => (
              <tr key={job.id} className="h-[52px] text-sm font-bold text-slate-500">
                <td className="px-4 align-middle font-black text-violet-500 sm:px-5">
                  {job.aikon}
                </td>
                <td className="px-4 align-middle">{job.nickname}</td>
                <td className="px-4 align-middle">{job.style}</td>
                <td className="px-4 align-middle">{job.profile}</td>
                <td className="px-4 align-middle">{job.status}</td>
                <td className="px-4 align-middle">{job.createdAt}</td>
                <td className="px-4 align-middle">
                  <button
                    type="button"
                    onClick={() => onDelete(job.id)}
                    className="text-sm font-black text-rose-500 transition-colors hover:text-rose-600"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
