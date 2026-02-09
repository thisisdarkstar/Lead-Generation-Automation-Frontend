"use client";
import { createContext, useContext, useState, useCallback } from "react";

// Toast Context
const ToastContext = createContext(null);

// Toast types with their styles
const TOAST_STYLES = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
    warning: "bg-yellow-500 text-black",
};

// Toast icons
const TOAST_ICONS = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
};

// Individual Toast component
function Toast({ message, type = "success", onClose }) {
    return (
        <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl animate-slide-in ${TOAST_STYLES[type]}`}
            style={{
                animation: "slideIn 0.3s ease-out",
            }}
        >
            <span className="text-xl font-bold">{TOAST_ICONS[type]}</span>
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 text-lg opacity-70 hover:opacity-100 transition-opacity"
            >
                ×
            </button>
        </div>
    );
}

// Toast Container - shows all active toasts
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

// Toast Provider
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after duration
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Convenience methods
    const toast = {
        success: (msg, duration) => addToast(msg, "success", duration),
        error: (msg, duration) => addToast(msg, "error", duration),
        info: (msg, duration) => addToast(msg, "info", duration),
        warning: (msg, duration) => addToast(msg, "warning", duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
