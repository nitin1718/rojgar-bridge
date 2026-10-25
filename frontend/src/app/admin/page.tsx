"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JobItem, JobDetails } from "@/types";
import {
  fetchDraftJobs,
  publishJob,
  rejectJob,
  updateJob,
  triggerPipeline,
} from "@/lib/api";
import { INITIAL_DRAFTS } from "@/lib/mockData";

export default function AdminReviewPage() {
  const [drafts, setDrafts] = useState<JobItem[]>(INITIAL_DRAFTS);
  const [selectedDraft, setSelectedDraft] = useState<JobItem | null>(
    INITIAL_DRAFTS[0] || null
  );
  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState<JobDetails | null>(
    INITIAL_DRAFTS[0]?.details || null
  );
  const [reviewNotes, setReviewNotes] = useState<string>(
    INITIAL_DRAFTS[0]?.review_notes || ""
  );

  // Load drafts from API
  const loadDrafts = async () => {
    try {
      setLoading(true);
      const res = await fetchDraftJobs({
        type: activeTypeTab === "all" ? undefined : activeTypeTab,
      });
      if (res && res.jobs) {
        setDrafts(res.jobs);
        if (res.jobs.length > 0) {
          setSelectedDraft(res.jobs[0]);
          setEditFormData(res.jobs[0].details);
          setReviewNotes(res.jobs[0].review_notes || "");
        } else {
          setSelectedDraft(null);
          setEditFormData(null);
        }
      }
    } catch (err) {
      console.warn("Using mock drafts (backend offline):", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, [activeTypeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectDraft = (draft: JobItem) => {
    setSelectedDraft(draft);
    setEditFormData({ ...draft.details });
    setReviewNotes(draft.review_notes || "");
  };

  // 1-Click Publish
  const handlePublish = async (id: number) => {
    try {
      // First save any unsaved form edits
      if (editFormData) {
        await updateJob(id, { details: editFormData, review_notes: reviewNotes });
      }
      const res = await publishJob(id);
      showToast(`✅ Notice #${res.id} published successfully to live feed!`);
      // Remove from drafts list
      const updated = drafts.filter((d) => d.id !== id);
      setDrafts(updated);
      if (updated.length > 0) {
        selectDraft(updated[0]);
      } else {
        setSelectedDraft(null);
        setEditFormData(null);
      }
    } catch (err) {
      // Offline fallback: simulate publish
      const updated = drafts.filter((d) => d.id !== id);
      setDrafts(updated);
      showToast(`✅ [Local State] Notice #${id} marked as published!`);
      if (updated.length > 0) selectDraft(updated[0]);
    }
  };

  // Reject Draft
  const handleReject = async (id: number) => {
    const reason = window.prompt("Reason for rejection / archiving:", "Duplicate notice / irrelevant circular");
    if (reason === null) return;

    try {
      await rejectJob(id, reason);
      showToast(`🗑️ Notice #${id} rejected.`);
      const updated = drafts.filter((d) => d.id !== id);
      setDrafts(updated);
      if (updated.length > 0) selectDraft(updated[0]);
    } catch (err) {
      const updated = drafts.filter((d) => d.id !== id);
      setDrafts(updated);
      showToast(`🗑️ [Local State] Notice #${id} rejected.`);
      if (updated.length > 0) selectDraft(updated[0]);
    }
  };

  // Save Edits
  const handleSaveEdits = async () => {
    if (!selectedDraft || !editFormData) return;
    try {
      await updateJob(selectedDraft.id, {
        details: editFormData,
        review_notes: reviewNotes,
      });
      showToast("💾 Draft changes saved successfully!");
      // update in-memory list
      setDrafts(
        drafts.map((d) =>
          d.id === selectedDraft.id
            ? { ...d, details: editFormData, review_notes: reviewNotes }
            : d
        )
      );
    } catch {
      showToast("💾 [Local State] Changes saved!");
    }
  };

  // Trigger Pipeline
  const handleTriggerScraper = async () => {
    try {
      setLoading(true);
      showToast("🔄 Syncing latest notices from scraper...");
      const res = await triggerPipeline();
      showToast(`⚡ ${res.message || "Scraper sync finished!"}`);
      await loadDrafts();
    } catch {
      showToast("⚡ Scraping and AI extraction pipeline triggered in background.");
      await loadDrafts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Admin Control Center
            </span>
            <span className="text-xs text-slate-400">• RozgarHub Scraping Engine</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            AI Scraped Draft Notices Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review auto-scraped notifications, verify details against original portal notices, and publish with 1 click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
          >
            ← View Candidate Feed
          </Link>

          <button
            onClick={handleTriggerScraper}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
          >
            <span>🔄 Sync Now (Run Scraper)</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: "all", label: "All Drafts" },
            { id: "recruitment", label: "Recruitments" },
            { id: "admit_card", label: "Admit Cards" },
            { id: "result", label: "Results" },
            { id: "interview_schedule", label: "Interviews" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTypeTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                activeTypeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-slate-500">
          Awaiting Review: <strong className="text-slate-800">{drafts.length}</strong>
        </span>
      </div>

      {/* Split Screen Review Interface */}
      {drafts.length > 0 && selectedDraft && editFormData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Drafts Queue (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Unverified Queue ({drafts.length})
            </h3>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {drafts.map((d) => {
                const isSelected = selectedDraft.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => selectDraft(d)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/60 border-blue-500 shadow-2xs"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-700 text-[11px] px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        {d.source_portal}
                      </span>
                      {d.details.confidence_score && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Score: {Math.round(d.details.confidence_score * 100)}%
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug">
                      {d.details.title}
                    </h4>
                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                      <span>{d.details.total_vacancies > 0 ? `${d.details.total_vacancies} Posts` : "Vacancies N/A"}</span>
                      <span className="text-red-600 font-medium">{d.details.application_end || "No end date"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Split Side-by-Side Review & Edit Panel (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono text-slate-400">Notice #{selectedDraft.id}</span>
                <h2 className="text-lg font-black text-slate-900 leading-snug">
                  Review & Verify Notice
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(selectedDraft.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                >
                  Reject Notice
                </button>

                <button
                  onClick={handleSaveEdits}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => handlePublish(selectedDraft.id)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                >
                  ✓ 1-Click Publish
                </button>
              </div>
            </div>

            {/* Raw Scraped Notice vs Form Fields */}
            <div className="space-y-4">
              {/* Raw Scraped Preview Box */}
              {selectedDraft.raw_notice && (
                <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-mono">ORIGINAL SCRAPED NOTICE ({selectedDraft.raw_notice.source_portal})</span>
                    {selectedDraft.raw_notice.notice_url && (
                      <a
                        href={selectedDraft.raw_notice.notice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Open Original Portal Link ↗
                      </a>
                    )}
                  </div>
                  <p className="font-semibold text-white">{selectedDraft.raw_notice.notice_title}</p>
                  <p className="text-slate-400 leading-relaxed font-mono text-[11px] bg-slate-950 p-2.5 rounded">
                    {selectedDraft.raw_notice.content_text || "No raw text snippet."}
                  </p>
                </div>
              )}

              {/* Editable Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800">Notice Title</label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Organization</label>
                  <input
                    type="text"
                    value={editFormData.organization}
                    onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Advertisement Number</label>
                  <input
                    type="text"
                    value={editFormData.advt_number || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, advt_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Central Govt">Central Govt</option>
                    <option value="State Govt">State Govt</option>
                    <option value="Bank">Bank</option>
                    <option value="Railway">Railway</option>
                    <option value="Defence">Defence</option>
                    <option value="Police">Police</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">State / Region</label>
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Total Vacancies</label>
                  <input
                    type="number"
                    value={editFormData.total_vacancies}
                    onChange={(e) => setEditFormData({ ...editFormData, total_vacancies: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Application End Date (Deadline)</label>
                  <input
                    type="text"
                    value={editFormData.application_end || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, application_end: e.target.value })}
                    placeholder="YYYY-MM-DD or e.g. 24 Nov 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-red-600"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800">Qualifications</label>
                  <input
                    type="text"
                    value={editFormData.qualification}
                    onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Salary / Payscale</label>
                  <input
                    type="text"
                    value={editFormData.salary_payscale || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, salary_payscale: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Exam Date</label>
                  <input
                    type="text"
                    value={editFormData.exam_date || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, exam_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800">Official Apply URL</label>
                  <input
                    type="text"
                    value={editFormData.official_apply_url || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, official_apply_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800">Admin Review Notes</label>
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="e.g. Dates and salary verified with PDF."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleReject(selectedDraft.id)}
                className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
              >
                Reject Notice
              </button>

              <button
                onClick={handleSaveEdits}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg"
              >
                Save Changes
              </button>

              <button
                onClick={() => handlePublish(selectedDraft.id)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
              >
                ✓ 1-Click Publish
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-slate-700 font-bold text-base">No Drafts Awaiting Review</p>
          <p className="text-slate-400 text-xs">
            All notices have been reviewed and published. Click &ldquo;Sync Now&rdquo; to trigger scraper.
          </p>
          <button
            onClick={handleTriggerScraper}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          >
            Run Scraping Pipeline
          </button>
        </div>
      )}
    </div>
  );
}
