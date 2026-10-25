import type { Metadata } from "next";
import "./globals.css";
import TopGovernmentBar from "@/components/TopGovernmentBar";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "NaukriSetu | Sarkari Naukri, Simplified",
  description: "Explore government job notifications, admit cards, results, and syllabus with simplified official updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased pb-16 lg:pb-0">
        <TopGovernmentBar />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
