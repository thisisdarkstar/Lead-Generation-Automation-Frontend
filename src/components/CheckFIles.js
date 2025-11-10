import React, { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_FILES = `${baseUrl}/api/files`;
const API_CLEAR = `${baseUrl}/api/clear-files`;

export default function CheckFiles() {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const fetchFiles = async () => {
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(API_FILES);
            if (!res.ok) throw new Error("Error fetching files!");
            const json = await res.json();
            setFiles(json.files || []);
            setResult({ count: json.count });
        } catch (e) {
            setError(e.message || String(e));
        }
        setLoading(false);
    };

    const clearFiles = async () => {
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(API_CLEAR, { method: "DELETE" });
            if (!res.ok) throw new Error("Error clearing files!");
            const json = await res.json();
            setFiles([]);
            setResult(json);
        } catch (e) {
            setError(e.message || String(e));
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating button */}
            {!show && (
                <button
                    className="fixed bottom-7 right-7 z-50 bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-8 rounded-full shadow-xl focus:outline-none transition-all cursor-pointer"
                    onClick={() => setShow(true)}
                >
                    Check Files
                </button>
            )}

            {/* Floating panel */}
            {show && (
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-md rounded-2xl shadow-2xl bg-gray-900 text-gray-100 border border-blue-600">
                    <div className="font-semibold text-lg px-6 pt-6 pb-2 flex justify-between items-center">
                        <span>File Management</span>
                        <button
                            onClick={() => { setShow(false); setFiles([]); setResult(null); setError(""); }}
                            className="ml-2 py-1 px-3 bg-gray-700 hover:bg-gray-800 font-bold rounded-lg text-sm transition-all cursor-pointer"
                        >Close</button>
                    </div>
                    <div className="px-6 pb-4 flex flex-wrap gap-3">
                        <button
                            onClick={fetchFiles}
                            className="bg-blue-700 hover:bg-blue-800 rounded-lg py-2 px-4 text-white font-bold transition-all cursor-pointer"
                            disabled={loading}
                        >Get File List</button>
                        <button
                            onClick={clearFiles}
                            className="bg-rose-600 hover:bg-rose-700 rounded-lg py-2 px-4 text-white font-bold transition-all cursor-pointer"
                            disabled={loading}
                        >Clear Files</button>
                    </div>
                    <div className="px-6 pb-4">
                        {loading && <div className="animate-pulse text-blue-300">Loading...</div>}
                        {error && <div className="text-red-300 my-2">Error: {error}</div>}

                        {result && (
                            <pre className="text-blue-200 text-xs bg-gray-800 rounded p-3 my-3 max-h-48 overflow-y-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        )}

                        {files && files.length > 0 && (
                            <div className="my-2">
                                <div className="font-bold text-amber-300 mb-1">
                                    Files <span className="text-blue-300">({files.length})</span>
                                </div>
                                <ul className="list-disc list-inside max-h-32 overflow-y-auto pl-1">
                                    {files.map(f =>
                                        <li key={f.filename} className="mb-1">
                                            <span className="text-sky-300 font-semibold">{f.filename}</span>
                                            <span className="ml-2 text-sm text-gray-400">{Math.round(f.size / 1024)} KB</span>
                                            <span className="ml-3 text-xs text-gray-500">{f.modified}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

