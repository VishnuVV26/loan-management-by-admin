"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type ConfirmState = ConfirmOptions & {
  id: string;
  open: boolean;
  resolve?: (value: boolean) => void;
};

const ConfirmContext = createContext<{
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      const id = Math.random().toString(36).slice(2);
      setState({ id, open: true, ...opts, resolve });
    });
  }, []);

  const close = (result: boolean) => {
    if (state?.resolve) state.resolve(result);
    setState((s) => (s ? { ...s, open: false } : s));
    setTimeout(() => setState(null), 150);
  };

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state?.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ width: 300,  background:
                "radial-gradient(1000px 600px at -10% 10%, rgba(88,28,135,0.6), transparent 60%), radial-gradient(1000px 600px at 110% 20%, rgba(59,7,100,0.7), transparent 60%), linear-gradient(135deg, #0b1020, #0a0f1f 60%, #0b1020)", borderRadius: 10, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{state.title || "Are you sure?"}</h3>
            {state.description && (
              <p style={{ color: "#fff", marginBottom: 12 }}>{state.description}</p>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => close(false)}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#0000", cursor: "pointer" }}
              >
                {state.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => close(true)}
                style={{ padding: "8px 12px", borderRadius: 8, border: 0, background: state.danger ? "#ef4444" : "#111827", color: "#fff", cursor: "pointer" }}
              >
                {state.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx.confirm;
}
