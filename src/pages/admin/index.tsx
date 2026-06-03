import { ChevronDown, RefreshCw } from 'lucide-react'

const jobs = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  aikon: 'Akikon555',
  nickname: '별빛전사',
  style: '지브리풍',
  profile: '남자/8~13',
  status: '완료',
  createdAt: '2026-5-19 15:32',
}))

export default function AdminPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#fdfcff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(196,181,253,0.38),transparent_28%),radial-gradient(circle_at_100%_100%,rgba(251,207,232,0.48),transparent_30%)]" />

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[840px] flex-col px-5 py-12 sm:py-14 lg:py-16">
        <header className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-normal text-slate-950 sm:text-[30px]">
              관리자 대시보드
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">AI PASS 발급 시스템 관리</p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            시스템 정상
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <SummaryCard title="API WORKER">
            <div className="mt-5 flex items-end gap-1.5">
              <strong className="text-[32px] leading-none font-black text-slate-950">3</strong>
              <span className="pb-1 text-xl font-black text-slate-500">/12 활성</span>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[28%] rounded-full bg-violet-500" />
            </div>
          </SummaryCard>

          <SummaryCard title="대기 큐">
            <div className="mt-5 flex items-end gap-2">
              <strong className="text-[32px] leading-none font-black text-slate-950">8</strong>
              <span className="pb-1 text-xl font-black text-slate-600">건 대기 중</span>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-400">예상 처리 시간 : 320초</p>
          </SummaryCard>
        </div>

        <section className="mt-6 overflow-hidden rounded-[10px] border-2 border-violet-100 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80 text-xs font-black text-slate-500">
                  <th className="px-4 py-3.5 sm:px-5">AIKON</th>
                  <th className="px-4 py-3.5">닉네임</th>
                  <th className="px-4 py-3.5">스타일</th>
                  <th className="px-4 py-3.5">성별/나이</th>
                  <th className="px-4 py-3.5">상태</th>
                  <th className="px-4 py-3.5">시간</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="text-sm font-bold text-slate-500">
                    <td className="px-4 py-4 font-black text-violet-500 sm:px-5">{job.aikon}</td>
                    <td className="px-4 py-4">{job.nickname}</td>
                    <td className="px-4 py-4">{job.style}</td>
                    <td className="px-4 py-4">{job.profile}</td>
                    <td className="px-4 py-4">{job.status}</td>
                    <td className="px-4 py-4">{job.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-[10px] border-2 border-rose-500 bg-white/70 px-4 py-4 sm:px-5">
          <h2 className="text-sm font-black text-rose-500">위험 구역</h2>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            시스템 전체 데이터를 초기화합니다. 되돌릴 수 없어요!
          </p>
          <button
            type="button"
            className="mt-4 h-10 w-full max-w-[220px] rounded-[10px] border-2 border-rose-500 bg-white text-sm font-black text-rose-500 transition-colors hover:bg-rose-50"
          >
            시스템 데이터 전체 초기화
          </button>
        </section>
      </section>
    </main>
  )
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="min-h-[130px] rounded-[10px] border-2 border-violet-100 bg-white/78 p-4 backdrop-blur sm:p-5">
      <h2 className="text-sm font-black text-slate-500">{title}</h2>
      {children}
    </article>
  )
}
