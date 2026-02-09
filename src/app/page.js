"use client"
import React, { useState } from "react";
import DomainUploader from "@/components/DomainUploader";
import LeadsJsonExtractor from "@/components/LeadsJsonExtractor";
import HtmlDomainExtractor from "@/components/HtmlDomainExtractor";
import LeadGenerator from "@/components/LeadGeneration";
import FetchAllocations from "@/components/FetchAllocations";
import HealthCheck from "@/components/HealthCheck";
import CheckFiles from "@/components/CheckFIles"; // Import your floating component
import BannerAd from "@/components/BannerAd"; // Banner Ad component
import NativeBannerAd from "@/components/NativeBannerAd"; // Native Banner Ad component
import { ToastProvider } from "@/components/Toast"; // Toast Provider

const TABS = [
  { id: "csv", label: "CSV to Domains" },
  { id: "leads", label: "Extract From JSON" },
  { id: "html", label: "Extract From HTML" },
  { id: "lead_gen", label: "Lead Generation" },
  { id: "fetch_alloc", label: "Fetch Allocations" }
];

export default function Home() {
  const [tab, setTab] = useState("csv");
  const [domains, setDomains] = useState([]);
  const [showHealth, setShowHealth] = useState(false);

  return (
    <ToastProvider>
      <main className="mx-auto p-6">
        {/* Top Banner Ad */}
        <div className="mb-6 flex justify-center">
          <BannerAd />
        </div>

        <nav className="mb-4 flex gap-4 items-center justify-center">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`
                px-3 py-2 rounded transition-colors cursor-pointer
                ${tab === t.id
                  ? "border-b-2 border-blue-700 font-bold text-blue-100 bg-blue-900/70"
                  : "bg-gray-700 text-gray-100 opacity-85 hover:bg-gray-600"}
              `}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <section>
          <div className={tab === "csv" ? "" : "hidden"}>
            <DomainUploader onExtracted={d => setDomains(d)} />
          </div>
          <div className={tab === "leads" ? "" : "hidden"}>
            <LeadsJsonExtractor initialDomains={domains} />
          </div>
          <div className={tab === "html" ? "" : "hidden"}>
            <HtmlDomainExtractor onExtracted={d => setDomains(d)} />
          </div>
          <div className={tab === "lead_gen" ? "" : "hidden"}>
            <LeadGenerator />
          </div>
          <div className={tab === "fetch_alloc" ? "" : "hidden"}>
            <FetchAllocations />
          </div>
        </section>

        {/* Bottom Native Banner Ad */}
        <div className="mt-6 flex justify-center">
          <NativeBannerAd />
        </div>
      </main>

      {/* Floating HealthCheck button */}
      <button
        onClick={() => setShowHealth(true)}
        className="fixed bottom-32 right-7 z-50 bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-full font-bold text-lg shadow-xl cursor-pointer"
      >
        Check Health
      </button>

      {/* HealthCheck modal/dialog (Tailwind) */}
      {showHealth && (
        <div
          className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center"
          onClick={() => setShowHealth(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-[90vw]"
          >
            <HealthCheck />
            <button
              onClick={() => setShowHealth(false)}
              className="block mx-auto mt-8 bg-blue-700 hover:bg-blue-800 text-white px-8 py-2 rounded-lg font-bold shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating CheckFiles utility */}
      <CheckFiles />
    </ToastProvider>
  );
}
