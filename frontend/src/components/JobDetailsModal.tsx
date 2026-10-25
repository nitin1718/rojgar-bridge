"use client";

import { JobItem } from "@/types";

interface JobDetailsModalProps {
  job: JobItem | null;
  onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  if (!job) return null;
  const d = job.details;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {d.category || "Central Govt"}
              </span>
              <span className="text-xs text-slate-500">• {d.organization}</span>
              {d.advt_number && (
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {d.advt_number}
                </span>
              )}
              {d.confidence_score && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  AI Match: {Math.round(d.confidence_score * 100)}%
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {d.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Total Vacancies</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {d.total_vacancies > 0 ? `${d.total_vacancies} Posts` : "Refer PDF"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Last Date</p>
            <p className="text-base font-bold text-red-600 mt-0.5">
              {d.application_end || "Refer notification"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Age Limit</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {d.min_age && d.max_age ? `${d.min_age} - ${d.max_age} Yrs` : "As per rules"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Exam Date</p>
            <p className="text-base font-bold text-slate-900 mt-0.5 truncate">
              {d.exam_date || "To be announced"}
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4 text-sm text-slate-700">
          {/* Pay Scale */}
          {d.salary_payscale && (
            <div>
              <h4 className="font-bold text-slate-900 mb-1">💰 Pay Scale & Salary</h4>
              <p className="bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-lg border border-emerald-200 font-medium">
                {d.salary_payscale}
              </p>
            </div>
          )}

          {/* Qualification */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1">🎓 Educational Qualification</h4>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {d.qualification}
            </p>
          </div>

          {/* Application Fee */}
          {(d.fee_general || d.fee_reserved) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Application Fee (General/OBC)</span>
                <span className="text-sm font-bold text-slate-800">{d.fee_general || "Refer notice"}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Reserved Fee (SC/ST/Female)</span>
                <span className="text-sm font-bold text-slate-800">{d.fee_reserved || "Refer notice"}</span>
              </div>
            </div>
          )}

          {/* Summary Points from AI Scraper */}
          {d.summary_points && d.summary_points.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">📌 Key Highlights</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                {d.summary_points.map((pt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div>
            {d.official_notice_url && (
              <a
                href={d.official_notice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                <span>📄 View Official Notification PDF</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <a
              href={d.official_apply_url || d.official_notice_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>Apply Online Portal</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
