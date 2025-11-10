import { downloadAsJson } from "@/utils/fileSaver";
import React, { useRef, useState, useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${baseUrl}/api/find-leads`;
const DOMAIN_HANDOFF_KEY = "leadGenHandoffDomains";
const LEADGEN_RESULT_KEY = "leadGeneratorResults";

export default function LeadGenerator() {
    const [mode, setMode] = useState("single");
    const [singleDomain, setSingleDomain] = useState("");
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState();
    const [pasteText, setPasteText] = useState("");
    const [domains, setDomains] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        if (mode === "paste" && typeof window !== "undefined") {
            const saved = window.localStorage.getItem(DOMAIN_HANDOFF_KEY);
            if (saved) {
                try {
                    const arr = JSON.parse(saved);
                    if (Array.isArray(arr)) setPasteText(arr.join('\n'));
                } catch { }
            }
        }
    }, [mode]);

    useEffect(() => {
        if (mode === "paste" && typeof window !== "undefined") {
            const arr = pasteText.split('\n').map(x => x.trim()).filter(Boolean);
            setDomains(arr);
            window.localStorage.setItem(DOMAIN_HANDOFF_KEY, JSON.stringify(arr));
        } else if (mode === "file" && !file) {
            setDomains([]);
        }
    }, [pasteText, mode, file]);

    const clearPaste = () => {
        setPasteText("");
        setDomains([]);
        if (typeof window !== "undefined")
            window.localStorage.removeItem(DOMAIN_HANDOFF_KEY);
    };

    const handleSingleGen = async () => {
        setResult(null); setError(""); setLoading(true);
        try {
            const url = `${API_BASE}?domain=${encodeURIComponent(singleDomain.trim())}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error((await res.json()).detail || `Status: ${res.status}`);
            setResult(await res.json());
        } catch (e) { setError(e.message || String(e)); }
        setLoading(false);
    };

    const handlePasteGen = async () => {
        setResult(null); setError(""); setLoading(true);
        try {
            if (domains.length === 0) throw new Error("No domains provided.");
            const formData = new FormData();
            const blob = new Blob([domains.join('\n')], { type: "text/plain" });
            formData.append("file", blob, "domains.txt");
            formData.append("debug", "false");
            const res = await fetch(API_BASE, {
                method: "POST", body: formData
            });
            if (!res.ok) throw new Error((await res.json()).detail || `Status: ${res.status}`);
            const jsonResponse = await res.json();
            const leads = jsonResponse.leads;
            setResult(leads);
        } catch (e) { setError(e.message || String(e)); }
        setLoading(false);
    };

    const handleFileGen = async () => {
        setResult(null);
        setError("");
        setLoading(true);
        try {
            if (!file) throw new Error("Please select a .txt file of domains.");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("debug", "false");
            const res = await fetch(API_BASE, { method: "POST", body: formData });
            if (!res.ok) throw new Error((await res.json()).detail || `Status: ${res.status}`);

            const jsonResponse = await res.json();
            const leads = jsonResponse.leads;
            setResult(leads);
        } catch (e) {
            setError(e.message || String(e));
        }
        setLoading(false);
    };


    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0]);
            e.target.files[0].text().then(text => {
                setDomains(text.split('\n').map(x => x.trim()).filter(Boolean));
            });
        } else {
            setFileName("");
            setFile(undefined);
            setDomains([]);
        }
    };

    const handleDownloadJSON = () => {
        if (!result) return;
        downloadAsJson(result, "leads_results.json");
    };

    const handleClearResult = () => setResult(null);

    // --- Add this handler ---
    const handleSendToExtractor = () => {
        if (!result) return;
        window.localStorage.setItem(LEADGEN_RESULT_KEY, JSON.stringify(result));
        alert("Lead generation results saved! Switch to 'Extract From JSON' and click 'Load from Lead Generator'.");
    };

    return (
        <main className="max-w-4xl mx-auto p-10">
            <h2 className="text-3xl font-bold mb-6">Lead Generator</h2>
            <div className="mb-6 flex gap-4">
                <button className={`px-3 py-2 rounded transition-colors cursor-pointer  ${mode === "single" ? "bg-blue-800 text-white" : "bg-gray-700 text-gray-100"}`}
                    onClick={() => setMode("single")}>Single Domain</button>
                <button className={`px-3 py-2 rounded transition-colors cursor-pointer  ${mode === "paste" ? "bg-blue-800 text-white" : "bg-gray-700 text-gray-100"}`}
                    onClick={() => setMode("paste")}>Paste Domains</button>
                <button className={`px-3 py-2 rounded transition-colors cursor-pointer  ${mode === "file" ? "bg-blue-800 text-white" : "bg-gray-700 text-gray-100"}`}
                    onClick={() => setMode("file")}>Upload TXT</button>
            </div>
            {mode === "single" && (
                <div className="mb-6">
                    <label className="block text-base font-medium mb-2">Domain Name</label>
                    <input type="text" value={singleDomain} onChange={e => setSingleDomain(e.target.value)}
                        placeholder="example.com"
                        className="px-3 py-2 rounded border border-gray-500 bg-gray-900 text-white w-96 shadow mb-2"
                        autoFocus />
                    <button
                        disabled={!singleDomain.trim() || loading}
                        onClick={handleSingleGen}
                        className="ml-3 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors disabled:opacity-60">
                        {loading ? "Finding..." : "Find Leads"}
                    </button>
                </div>)}
            {mode === "paste" && (
                <div className="mb-6">
                    <label className="block text-base font-medium mb-2">
                        Paste Domains <span className="font-normal text-gray-400">({domains.length})</span>
                    </label>
                    <textarea rows={7} value={pasteText} onChange={e => setPasteText(e.target.value)}
                        placeholder="domain1.com\ndomain2.com"
                        className="w-full p-2 rounded bg-gray-900 text-green-200 border mb-2"
                    />
                    <div className="flex gap-2 mb-3">
                        <button className="px-3 py-2 rounded bg-blue-800 hover:bg-blue-900 text-white font-medium transition-colors cursor-pointer "
                            onClick={() => {
                                if (typeof window !== "undefined") {
                                    const saved = window.localStorage.getItem(DOMAIN_HANDOFF_KEY);
                                    if (saved) {
                                        try {
                                            const domainsArr = JSON.parse(saved);
                                            if (Array.isArray(domainsArr)) setPasteText(domainsArr.join('\n'));
                                        } catch { }
                                    }
                                }
                            }}>Load from Uploader</button>
                        <button className="px-3 py-2 rounded bg-red-800 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer "
                            onClick={clearPaste}>Clear</button>
                    </div>
                    {domains.length > 0 && (
                        <div className="border rounded-lg p-4 mb-3 bg-gray-800 text-green-200 max-h-40 min-h-32 min-w-[420px] text-base leading-6 font-mono overflow-y-scroll shadow-md" style={{ letterSpacing: "0.01rem" }}>
                            {domains.map(d => <div key={d}>{d}</div>)}
                        </div>
                    )}
                    <button
                        disabled={domains.length === 0 || loading}
                        onClick={handlePasteGen}
                        className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors disabled:opacity-60 cursor-pointer ">
                        {loading ? "Finding..." : "Find Leads"}
                    </button>
                </div>
            )}
            {mode === "file" && (
                <div className="mb-6">
                    <label className="block text-base font-medium mb-2">Upload domains.txt</label>
                    <div className="relative flex items-center">
                        <button type="button" className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium mr-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 mb-4"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}>Choose TXT File</button>
                        <input ref={fileInputRef} type="file" accept=".txt" style={{ position: "absolute", left: 0, top: 0, width: "160px", height: "100%", opacity: 0, cursor: "pointer" }}
                            onChange={handleFileSelect} />
                        <span className="ml-2 text-gray-400">{fileName || "No file chosen"}</span>
                    </div>
                    {domains.length > 0 && (
                        <div className="border rounded-lg p-4 mb-3 bg-gray-800 text-green-200 max-h-40 min-h-32 min-w-[420px] text-base leading-6 font-mono overflow-y-scroll shadow-md" style={{ letterSpacing: "0.01rem" }}>
                            {domains.map(d => <div key={d}>{d}</div>)}
                        </div>
                    )}
                    <button
                        disabled={!file || loading}
                        onClick={handleFileGen}
                        className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors disabled:opacity-60 mt-2 cursor-pointer ">
                        {loading ? "Finding..." : "Find Leads"}
                    </button>
                </div>
            )}
            {error && <div className="text-red-400 mb-4">{error}</div>}
            {result && (
                <div className="mt-4">
                    <div className="mb-2 flex gap-3">
                        <button onClick={handleDownloadJSON}
                            className="px-4 py-2 rounded bg-green-800 hover:bg-green-700 text-white transition-colors cursor-pointer ">
                            Download JSON
                        </button>
                        <button onClick={handleSendToExtractor}
                            className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer ">
                            Send to JSON Extractor
                        </button>
                        <button onClick={handleClearResult}
                            className="px-4 py-2 rounded bg-red-800 hover:bg-red-700 text-white transition-colors cursor-pointer ">
                            Clear Result
                        </button>
                    </div>
                    <pre className="bg-gray-900 p-4 rounded max-h-96 overflow-y-auto text-xs text-gray-100">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </main>
    );
}
