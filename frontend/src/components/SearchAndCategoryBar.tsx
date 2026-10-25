"use client";

interface SearchAndCategoryBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategoryPill: string;
  onSelectCategoryPill: (pill: string) => void;
  activeFilterCount: number;
  onToggleFiltersModal: () => void;
}

const CATEGORY_PILLS = [
  "All Jobs",
  "SSC",
  "Railway",
  "Bank",
  "UPSC",
  "State Govt",
  "Defence",
  "Police",
  "Teaching",
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Engineering",
  "Medical",
];

export default function SearchAndCategoryBar({
  searchQuery,
  onSearchChange,
  selectedCategoryPill,
  onSelectCategoryPill,
  activeFilterCount,
  onToggleFiltersModal,
}: SearchAndCategoryBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Icon & Text input */}
        <div className="flex-1 flex items-center gap-3 px-3">
          <svg
            className="w-5 h-5 text-slate-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by job title, exam, department, or keyword..."
            className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Button & Search Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFiltersModal}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters ({activeFilterCount})</span>
          </button>

          <button className="flex-1 sm:flex-initial px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all hover:shadow">
            Search
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORY_PILLS.map((pill) => {
          const isSelected = selectedCategoryPill === pill;
          return (
            <button
              key={pill}
              onClick={() => onSelectCategoryPill(pill)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {pill}
            </button>
          );
        })}

        <button className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1">
          <span>More</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
