"use client";

import { useState } from "react";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-center gap-1.5 py-6 select-none">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        aria-label="Previous Page"
      >
        ‹
      </button>

      {/* Numbered buttons */}
      {pages.map((p) => {
        const isActive = currentPage === p;
        return (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-xs font-bold"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Ellipsis */}
      <span className="px-1 text-slate-400 text-xs">...</span>

      {/* Last page */}
      <button
        onClick={() => setCurrentPage(125)}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 ${
          currentPage === 125 ? "bg-blue-600 text-white font-bold" : ""
        }`}
      >
        125
      </button>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage((p) => Math.min(125, p + 1))}
        disabled={currentPage === 125}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
        aria-label="Next Page"
      >
        ›
      </button>
    </div>
  );
}
