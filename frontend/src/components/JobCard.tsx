import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
          <p className="text-sm font-medium text-slate-600">{job.company}</p>
        </div>
        <span className="self-start sm:self-center text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {job.type}
        </span>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            📍 {job.location}
          </span>
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            💰 {job.salary}
          </span>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
}
