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
      <div className="fixed z-[1000] grid gap-2 left-2 right-2 bottom-4 top-auto sm:left-auto sm:right-4 sm:top-4 sm:bottom-auto">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[260px] max-w-full sm:max-w-[360px] px-3 py-2.5 rounded-lg text-[14px] bg-[#0a0f1f] text-foreground border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.35)] flex items-start gap-3"
          >
            <span
              className={
                "mt-0.5 h-3.5 w-3.5 rounded-full " +
                (t.type === "success"
                  ? "bg-emerald-500"
                  : t.type === "error"
                  ? "bg-rose-500"
                  : t.type === "warning"
                  ? "bg-amber-400"
                  : "bg-sky-500")
              }
            />
            <span className="leading-5">{t.message}</span>
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
