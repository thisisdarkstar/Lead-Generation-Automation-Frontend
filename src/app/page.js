"use client"
import React, { useState } from "react";
import DomainUploader from "@/components/DomainUploader";
import LeadsJsonExtractor from "@/components/LeadsJsonExtractor";
import HtmlDomainExtractor from "@/components/HtmlDomainExtractor";
import LeadGenerator from "@/components/LeadGeneration";
import FetchAllocations from "@/components/FetchAllocations";
import HealthCheck from "@/components/HealthCheck"; // <- Import your component

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
    <>
      <main className="m-auto p-6">
        <nav className="mb-4 flex gap-4 items-center justify-center">
          {TABS.map(t => (
            <button
              key={t.id}
              style={{
                fontWeight: tab === t.id ? "bold" : "normal",
                borderBottom: tab === t.id ? "2px solid #1976d2" : "none",
                background: "none",
                padding: "8px 12px",
                cursor: "pointer"
              }}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <section>
          <div style={{ display: tab === "csv" ? "block" : "none" }}>
            <DomainUploader onExtracted={d => setDomains(d)} />
          </div>
          <div style={{ display: tab === "leads" ? "block" : "none" }}>
            <LeadsJsonExtractor initialDomains={domains} />
          </div>
          <div style={{ display: tab === "html" ? "block" : "none" }}>
            <HtmlDomainExtractor onExtracted={d => setDomains(d)} />
          </div>
          <div style={{ display: tab === "lead_gen" ? "block" : "none" }}>
            <LeadGenerator />
          </div>
          <div style={{ display: tab === "fetch_alloc" ? "block" : "none" }}>
            <FetchAllocations />
          </div>
        </section>
      </main>

      {/* Floating HealthCheck button */}
      <button
        onClick={() => setShowHealth(true)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 50,
          background: "#1976d2",
          color: "#fff",
          padding: "14px 24px",
          borderRadius: "50px",
          boxShadow: "0 3px 18px rgba(30,60,150,0.3)",
          fontWeight: "bold",
          fontSize: "18px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Check Health
      </button>

      {/* HealthCheck modal/dialog */}
      {showHealth && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 100,
            background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setShowHealth(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#181f2a", borderRadius: "16px", boxShadow: "0 6px 32px rgba(20,40,80,0.6)",
              padding: "32px", maxWidth: 480, width: "90vw"
            }}
          >
            <HealthCheck />
            <button
              onClick={() => setShowHealth(false)}
              style={{
                display: "block", margin: "24px auto 0 auto", background: "#1976d2", color: "#fff", padding: "8px 20px",
                borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
