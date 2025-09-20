"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

const ToastContext = createContext<{
  show: (type: ToastType, message: string, durationMs?: number) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((type: ToastType, message: string, durationMs: number = 2500) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, type, message };
    setToasts((prev) => [...prev, toast]);
    if (durationMs > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    }
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: "fixed", top: 16, right: 16, display: "grid", gap: 8, zIndex: 1000 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            minWidth: 260,
            maxWidth: 360,
            padding: "10px 12px",
            borderRadius: 8,
            color: t.type === "warning" ? "#7c2d12" : t.type === "error" ? "#7f1d1d" : t.type === "success" ? "#065f46" : "#111827",
            background: t.type === "warning" ? "#fef3c7" : t.type === "error" ? "#fee2e2" : t.type === "success" ? "#d1fae5" : "#e5e7eb",
            boxShadow: "0 5px 15px rgba(0,0,0,.15)",
            border: "1px solid rgba(0,0,0,.08)",
            fontSize: 14,
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
