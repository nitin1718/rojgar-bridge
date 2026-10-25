"use client";

import { JobItem } from "@/types";

interface JobMobileCardsProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
}

export default function JobMobileCards({ jobs, onSelectJob }: JobMobileCardsProps) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const d = job.details;
        return (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative flex items-center justify-between gap-3"
          >
            <div className="space-y-2 flex-1 min-w-0">
              {/* Title & Organization */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm tracking-tight line-clamp-2">
                  {d.title}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {d.organization}
                </p>
              </div>

              {/* Tag */}
              <div className="flex items-center gap-1.5">
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {d.category || "Central Govt"}
                </span>
                {d.notice_type && (
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                    {d.notice_type.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Meta row: Posts & Qualification */}
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="text-slate-400">👤</span>
                  <span className="font-medium text-slate-800">
                    {d.total_vacancies > 0 ? d.total_vacancies.toLocaleString() : "-"}
                  </span>
                </span>

                <span className="text-slate-300">|</span>

                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <span className="text-slate-400">🎓</span>
                  <span className="truncate">{d.qualification}</span>
                </span>
              </div>

              {/* Last Date in Red */}
              <div className="text-xs text-slate-600">
                <span>Last date: </span>
                <span className="font-bold text-red-600">
                  {d.application_end || "Refer notification"}
                </span>
              </div>
            </div>

            {/* Right chevron */}
            <div className="text-slate-400 flex-shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
