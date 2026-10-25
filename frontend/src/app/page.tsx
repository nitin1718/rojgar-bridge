"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { JobItem } from "@/types";
import { fetchPublishedJobs } from "@/lib/api";
import { INITIAL_PUBLISHED_JOBS } from "@/lib/mockData";
import SearchAndCategoryBar from "@/components/SearchAndCategoryBar";
import SidebarFilters from "@/components/SidebarFilters";
import JobTableView from "@/components/JobTableView";
import JobMobileCards from "@/components/JobMobileCards";
import Pagination from "@/components/Pagination";
import JobDetailsModal from "@/components/JobDetailsModal";

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_PUBLISHED_JOBS);
  const [totalCount, setTotalCount] = useState<number>(INITIAL_PUBLISHED_JOBS.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("All Jobs");

  // Sidebar Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "General",
    "OBC",
  ]);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([
    "Graduate",
  ]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"latest" | "deadline" | "posts">("latest");

  // Selected Job for Detail Modal
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  // Mobile Filters Modal State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isConnectedToBackend, setIsConnectedToBackend] = useState<boolean | null>(null);

  // Load from Go Backend API: GET /api/jobs/published
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchPublishedJobs({ limit: 50 });
        if (res && Array.isArray(res.jobs)) {
          if (res.jobs.length > 0) {
            setJobs(res.jobs);
            setTotalCount(res.count || res.jobs.length);
          }
          setIsConnectedToBackend(true);
        }
      } catch (err) {
        console.warn("Using offline mock data (backend not yet running):", err);
        setIsConnectedToBackend(false);
      }
    }
    loadData();
  }, []);

  // Compute active filters count
  const activeFilterCount =
    (selectedCategoryPill !== "All Jobs" ? 1 : 0) +
    selectedCategories.length +
    selectedQualifications.length +
    selectedStates.length +
    selectedJobTypes.length;

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedQualifications([]);
    setSelectedStates([]);
    setSelectedJobTypes([]);
    setSelectedCategoryPill("All Jobs");
    setSearchQuery("");
  };

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const d = job.details;

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          d.title.toLowerCase().includes(q) ||
          d.organization.toLowerCase().includes(q) ||
          d.qualification.toLowerCase().includes(q) ||
          (d.advt_number && d.advt_number.toLowerCase().includes(q)) ||
          d.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Category Pill Filter (e.g. UPSC, SSC, Railway, Bank)
      if (selectedCategoryPill !== "All Jobs") {
        const pill = selectedCategoryPill.toLowerCase();
        const pillMatches =
          d.title.toLowerCase().includes(pill) ||
          d.organization.toLowerCase().includes(pill) ||
          d.category.toLowerCase().includes(pill) ||
          d.qualification.toLowerCase().includes(pill) ||
          d.notice_type.toLowerCase().includes(pill);
        if (!pillMatches) return false;
      }

      // 3. Qualification Filter
      if (selectedQualifications.length > 0) {
        const matchesQual = selectedQualifications.some((q) =>
          d.qualification.toLowerCase().includes(q.toLowerCase())
        );
        if (!matchesQual) return false;
      }

      // 4. State Filter
      if (selectedStates.length > 0) {
        const matchesState =
          d.state === "All India" || selectedStates.includes(d.state);
        if (!matchesState) return false;
      }

      return true;
    });
  }, [
    jobs,
    searchQuery,
    selectedCategoryPill,
    selectedQualifications,
    selectedStates,
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Backend Status indicator */}
      {isConnectedToBackend === false && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>
              <strong>Backend Offline:</strong> Showing pre-loaded published notices. Connects automatically to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">http://localhost:8080/api/jobs/published</code> when started.
            </span>
          </div>
          <Link
            href="/admin"
            className="font-semibold text-blue-700 underline hover:text-blue-900"
          >
            Admin Review Drafts →
          </Link>
        </div>
      )}

      {/* Search & Category Pills Top Section */}
      <SearchAndCategoryBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategoryPill={selectedCategoryPill}
        onSelectCategoryPill={setSelectedCategoryPill}
        activeFilterCount={activeFilterCount}
        onToggleFiltersModal={() => setIsMobileFilterOpen(true)}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between pt-1">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <span>›</span>
          <span className="text-slate-800 font-semibold">Jobs</span>
        </nav>

        {/* Link to Admin Draft Review Dashboard */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
        >
          <span>🛡️ Admin Portal</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        </Link>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28">
          <SidebarFilters
            selectedCategories={selectedCategories}
            onChangeCategories={setSelectedCategories}
            selectedQualifications={selectedQualifications}
            onChangeQualifications={setSelectedQualifications}
            selectedStates={selectedStates}
            onChangeStates={setSelectedStates}
            selectedJobTypes={selectedJobTypes}
            onChangeJobTypes={setSelectedJobTypes}
            onClearAll={handleClearAll}
            onApplyFilters={() => {}}
            activeCount={activeFilterCount}
          />
        </aside>

        {/* Right Main Table & Listings */}
        <div className="lg:col-span-9 space-y-4">
          {/* Section Header & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Government Job Notifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Showing verified and published government job notices from official sources.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center text-xs">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <span className="text-slate-500">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="latest">Latest</option>
                  <option value="deadline">Closing Soon</option>
                  <option value="posts">Highest Posts</option>
                </select>
              </div>

              <span className="text-slate-400 font-medium">
                Total <strong className="text-slate-800">{totalCount}</strong> jobs
              </span>
            </div>
          </div>

          {/* Table View (Desktop & Tablet) */}
          <div className="hidden sm:block">
            {filteredJobs.length > 0 ? (
              <JobTableView
                jobs={filteredJobs}
                onSelectJob={(job) => setSelectedJob(job)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                <p className="text-slate-600 font-semibold text-base">
                  No notifications match your active filters
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Cards View (Mobile Devices) */}
          <div className="block sm:hidden">
            {filteredJobs.length > 0 ? (
              <JobMobileCards
                jobs={filteredJobs}
                onSelectJob={(job) => setSelectedJob(job)}
              />
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
                <p className="text-slate-600 font-semibold text-sm">
                  No notifications found
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination />
        </div>
      </div>

      {/* Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* Mobile Drawer Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Filter Jobs & Vacancies</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <SidebarFilters
              selectedCategories={selectedCategories}
              onChangeCategories={setSelectedCategories}
              selectedQualifications={selectedQualifications}
              onChangeQualifications={setSelectedQualifications}
              selectedStates={selectedStates}
              onChangeStates={setSelectedStates}
              selectedJobTypes={selectedJobTypes}
              onChangeJobTypes={setSelectedJobTypes}
              onClearAll={handleClearAll}
              onApplyFilters={() => setIsMobileFilterOpen(false)}
              activeCount={activeFilterCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}
