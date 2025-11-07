"use client";
import React, { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${baseUrl}/api/health`;

export default function HealthCheck() {
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [dataDir, setDataDir] = useState("");
    const [endpoints, setEndpoints] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const checkHealth = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const data = await res.json();
            setStatus(data.status);
            setMessage(data.message);
            setDataDir(data.data_dir);
            setEndpoints(data.endpoints_active);
        } catch (e) {
            setError(e.message || "Failed to check health");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 rounded bg-gray-900 text-green-100 shadow-md">
            <h2 className="text-xl font-bold mb-5">API Health Check</h2>
            <button
                onClick={checkHealth}
                className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white mb-4 font-medium"
                disabled={loading}
            >
                {loading ? "Checking..." : "Check Health"}
            </button>
            {error && <div className="mb-2 text-red-400">{error}</div>}
            {status && (
                <div className="mt-3">
                    <div><b>Status:</b> <span className={status === "healthy" ? "text-green-400" : "text-red-400"}>{status}</span></div>
                    <div><b>Message:</b> {message}</div>
                    <div><b>Data Dir:</b> {dataDir}</div>
                    <div><b>Endpoints Active:</b> {endpoints}</div>
                </div>
            )}
        </div>
    );
}
