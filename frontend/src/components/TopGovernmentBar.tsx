"use client";

import { useState } from "react";

export default function TopGovernmentBar() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <div className="bg-[#0f172a] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Emblem text */}
        <div className="flex items-center gap-2 font-medium">
          <svg
            className="w-4 h-4 text-amber-500 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.32v4.59c0 4.1-2.6 7.95-6 9-3.4-1.05-6-4.9-6-9V6.5l6-2.32z" />
          </svg>
          <span className="tracking-wide">
            भारत सरकार <span className="text-slate-500">|</span> Government of India
          </span>
        </div>

        {/* Right: Accessibility & Lang */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <button className="hover:text-white px-1 font-semibold" title="Increase Font">
              A+
            </button>
            <button className="hover:text-white px-1" title="Normal Font">
              A
            </button>
            <button className="hover:text-white px-1" title="Decrease Font">
              A-
            </button>
          </div>

          <span className="hidden sm:inline text-slate-700">|</span>

          <div className="flex items-center gap-1 font-medium">
            <button
              onClick={() => setLang("en")}
              className={`hover:text-white ${lang === "en" ? "text-white font-semibold underline underline-offset-2" : "text-slate-400"}`}
            >
              English
            </button>
            <span className="text-slate-500">/</span>
            <button
              onClick={() => setLang("hi")}
              className={`hover:text-white ${lang === "hi" ? "text-white font-semibold underline underline-offset-2" : "text-slate-400"}`}
            >
              हिन्दी
            </button>
          </div>

          <span className="text-slate-700">|</span>

          <button className="flex items-center gap-1 text-slate-300 hover:text-white">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="hidden md:inline">Accessibility</span>
          </button>
        </div>
      </div>
    </div>
  );
}
