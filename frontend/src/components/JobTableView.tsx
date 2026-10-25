"use client";

import { JobItem } from "@/types";

interface JobTableViewProps {
  jobs: JobItem[];
  onSelectJob: (job: JobItem) => void;
}

export default function JobTableView({ jobs, onSelectJob }: JobTableViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[12px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-5">Title</th>
              <th className="py-3.5 px-4">Organization</th>
              <th className="py-3.5 px-4 text-center sm:text-left">Posts</th>
              <th className="py-3.5 px-4">Qualification</th>
              <th className="py-3.5 px-4">Last Date</th>
              <th className="py-3.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {jobs.map((job) => {
              const d = job.details;
              return (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectJob(job)}
                >
                  {/* Title + Advt + Category Tag */}
                  <td className="py-4 px-5 align-top">
                    <div className="space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJob(job);
                        }}
                        className="font-bold text-blue-600 hover:text-blue-800 text-left block leading-snug"
                      >
                        {d.title}
                      </button>
                      {d.advt_number && (
                        <p className="text-xs text-slate-500 font-mono">
                          {d.advt_number}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {d.category || "Central Govt"}
                        </span>
                        {d.notice_type && (
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                            {d.notice_type.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Organization */}
                  <td className="py-4 px-4 align-top text-xs font-medium text-slate-700">
                    {d.organization}
                  </td>

                  {/* Posts / Total Vacancies */}
                  <td className="py-4 px-4 align-top text-xs font-semibold text-slate-800">
                    {d.total_vacancies > 0 ? d.total_vacancies.toLocaleString() : "-"}
                  </td>

                  {/* Qualification */}
                  <td className="py-4 px-4 align-top text-xs text-slate-600 max-w-[200px] truncate" title={d.qualification}>
                    {d.qualification}
                  </td>

                  {/* Last Date (Red Highlighted) */}
                  <td className="py-4 px-4 align-top text-xs font-bold text-red-600 whitespace-nowrap">
                    {d.application_end || "Refer notification"}
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-5 align-top text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJob(job);
                      }}
                      className="inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all shadow-2xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
