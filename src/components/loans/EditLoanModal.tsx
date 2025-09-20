"use client";

import { useEffect, useState } from "react";
import type { Loan, LoanPayment } from "@/lib/loans";

export type EditLoanModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (loan: Loan) => void;
  initial?: Loan | null;
  readOnly?: boolean;
};

export default function EditLoanModal({ open, onClose, onSaved, initial, readOnly = false }: EditLoanModalProps) {
  const [sno, setSno] = useState<number>(1);
  const [name, setName] = useState("");
  const [givenDate, setGivenDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [paid, setPaid] = useState<LoanPayment[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setSno(initial.sno);
      setName(initial.name);
      setGivenDate(initial.givenDate.slice(0, 10));
      setTotalAmount(initial.totalAmount);
      setInterest(initial.interest);
      setPaid(initial.paid || []);
    } else {
      setSno(1);
      setName("");
      setGivenDate(new Date().toISOString().slice(0, 10));
      setTotalAmount(0);
      setInterest(0);
      setPaid([]);
    }
  }, [initial, open]);

  if (!open) return null;

  const addPayment = () => {
    if (readOnly) return;
    setPaid((p) => [...p, { amount: 0, date: new Date().toISOString().slice(0, 10) }]);
  };
  const updatePayment = (idx: number, patch: Partial<LoanPayment>) => {
    if (readOnly) return;
    setPaid((p) => p.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removePayment = (idx: number) => {
    if (readOnly) return;
    setPaid((p) => p.filter((_, i) => i !== idx));
  };

  const onSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { sno, name, givenDate, totalAmount, interest, paid } as Omit<Loan, "_id">;
      let res: Response;
      if (initial && initial._id) {
        res = await fetch(`/api/loans/${initial._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/loans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed");
      onSaved(data.data);
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ width: 580, maxHeight: "90vh", overflow: "auto", background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>{readOnly ? "View Loan" : initial ? "Edit Loan" : "New Loan"}</h2>
          <button onClick={onClose} style={{ border: 0, background: "transparent", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <label>
              <div>S.No</div>
              <input type="number" value={sno} onChange={(e) => setSno(Number(e.target.value))} disabled={readOnly} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
            </label>
            <label>
              <div>Name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} disabled={readOnly} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              <div>Given Date</div>
              <input type="date" value={givenDate} onChange={(e) => setGivenDate(e.target.value)} disabled={readOnly} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
            </label>
            <label>
              <div>Total Amount</div>
              <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} disabled={readOnly} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
            </label>
          </div>

          <label>
            <div>Interest</div>
            <input type="number" value={interest} onChange={(e) => setInterest(Number(e.target.value))} disabled={readOnly} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
          </label>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontWeight: 600 }}>Payments</h3>
              {!readOnly && (
                <button type="button" onClick={addPayment} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", background: "#f9fafb", cursor: "pointer" }}>+ Add Payment</button>
              )}
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              {paid.map((p, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
                  <input type="number" value={p.amount} onChange={(e) => updatePayment(idx, { amount: Number(e.target.value) })} placeholder="Amount" disabled={readOnly} style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
                  <input type="date" value={p.date.slice(0,10)} onChange={(e) => updatePayment(idx, { date: e.target.value })} disabled={readOnly} style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6, background: readOnly ? "#f9fafb" : undefined }} />
                  {!readOnly && (
                    <button type="button" onClick={() => removePayment(idx)} style={{ padding: "6px 10px", borderRadius: 6, border: 0, background: "#ef4444", color: "#fff", cursor: "pointer" }}>Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <div style={{ color: "#b00020" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={onClose} disabled={saving} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>Close</button>
            {!readOnly && (
              <button onClick={onSubmit} disabled={saving} style={{ padding: "8px 12px", borderRadius: 6, border: 0, background: "#111827", color: "#fff", cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
