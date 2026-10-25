"use client";

import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Jobs");

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Admit Card", href: "#" },
    { name: "Results", href: "#" },
    { name: "Syllabus", href: "#" },
    { name: "Exam Calendar", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3">
            {/* National Emblem Vector */}
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-1.5 shadow-sm">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full text-slate-800"
                fill="currentColor"
              >
                {/* Ashoka Pillar Lion Capital stylized icon */}
                <path d="M32 4c-4.4 0-8 3.6-8 8 0 2.2.9 4.2 2.3 5.7C24.4 19 23 21.3 23 24c0 3.3 2.7 6 6 6h6c3.3 0 6-2.7 6-6 0-2.7-1.4-5-3.3-6.3 1.4-1.5 2.3-3.5 2.3-5.7 0-4.4-3.6-8-8-8zm-6 28c-4.4 0-8 3.6-8 8v6h28v-6c0-4.4-3.6-8-8-8h-12zm-3 18h38v8H23v-8z" />
                <circle cx="32" cy="52" r="3" fill="#2563eb" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Naukri<span className="text-blue-600">Setu</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-1">
                Sarkari Naukri, Simplified.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 h-full">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`relative h-full flex items-center text-sm font-semibold transition-colors px-1 ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-md" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <span>🛡️ Admin Review</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </Link>

            <button
              onClick={onSearchClick}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
              title="Search"
            >
              <svg
                className="w-5 h-5"
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
            </button>

            <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg transition-colors">
              Login
            </button>

            <button className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow">
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger & search */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onSearchClick}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Search"
            >
              <svg
                className="w-5 h-5"
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
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setActiveTab(link.name);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  activeTab === link.name
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="flex gap-2 pt-3 border-t border-slate-100 px-3">
              <button className="flex-1 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700">
                Login
              </button>
              <button className="flex-1 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
