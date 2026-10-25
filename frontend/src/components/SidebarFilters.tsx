"use client";

import { useState } from "react";

interface SidebarFiltersProps {
  selectedCategories: string[];
  onChangeCategories: (cats: string[]) => void;
  selectedQualifications: string[];
  onChangeQualifications: (quals: string[]) => void;
  selectedStates: string[];
  onChangeStates: (states: string[]) => void;
  selectedJobTypes: string[];
  onChangeJobTypes: (types: string[]) => void;
  onClearAll: () => void;
  onApplyFilters?: () => void;
  activeCount: number;
}

const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS"];
const QUALIFICATION_OPTIONS = [
  "10th/12th Pass",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "B.Tech/BE",
];
const ALL_STATES = [
  "All India",
  "Delhi",
  "Maharashtra",
  "Uttar Pradesh",
  "Rajasthan",
  "Madhya Pradesh",
  "Gujarat",
  "Bihar",
  "Haryana",
  "Punjab",
  "Karnataka",
];
const JOB_TYPE_OPTIONS = ["Full-time", "Contractual", "Apprenticeship"];

export default function SidebarFilters({
  selectedCategories,
  onChangeCategories,
  selectedQualifications,
  onChangeQualifications,
  selectedStates,
  onChangeStates,
  selectedJobTypes,
  onChangeJobTypes,
  onClearAll,
  onApplyFilters,
  activeCount,
}: SidebarFiltersProps) {
  const [stateSearch, setStateSearch] = useState("");
  const [showAllStates, setShowAllStates] = useState(false);

  const toggleItem = (list: string[], item: string, setter: (res: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const filteredStates = ALL_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const visibleStates = showAllStates ? filteredStates : filteredStates.slice(0, 7);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Filter Jobs & Vacancies</h3>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear All
        </button>
      </div>

      {/* 1. Category */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 tracking-wide">Category</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {CATEGORY_OPTIONS.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2 text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(selectedCategories, cat, onChangeCategories)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Qualification */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 tracking-wide">Qualification</h4>
        <div className="space-y-2 text-xs">
          {QUALIFICATION_OPTIONS.map((qual) => {
            const isChecked = selectedQualifications.includes(qual);
            return (
              <label
                key={qual}
                className="flex items-center gap-2 text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    toggleItem(selectedQualifications, qual, onChangeQualifications)
                  }
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>{qual}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. State/Region */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 tracking-wide">State/Region</h4>
        {/* State Search */}
        <div className="relative">
          <svg
            className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            placeholder="Search States"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2 text-xs">
          {visibleStates.map((st) => {
            const isChecked = selectedStates.includes(st);
            return (
              <label
                key={st}
                className="flex items-center gap-2 text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(selectedStates, st, onChangeStates)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>{st}</span>
              </label>
            );
          })}
        </div>

        {filteredStates.length > 7 && (
          <button
            onClick={() => setShowAllStates(!showAllStates)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{showAllStates ? "Show Less ⌃" : "Show More ⌄"}</span>
          </button>
        )}
      </div>

      {/* 4. Job Type */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 tracking-wide">Job Type</h4>
        <div className="space-y-2 text-xs">
          {JOB_TYPE_OPTIONS.map((type) => {
            const isChecked = selectedJobTypes.includes(type);
            return (
              <label
                key={type}
                className="flex items-center gap-2 text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(selectedJobTypes, type, onChangeJobTypes)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={onClearAll}
          className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onApplyFilters}
          className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
        >
          Apply Filters ({activeCount})
        </button>
      </div>
    </div>
  );
}
