"use client";

import { useEffect, useState } from "react";
import type { Loan, LoanPayment } from "@/lib/loans";
import Spinner from "@/components/ui/Spinner";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="w-[95vw] max-w-[680px] max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-[#0a0f1f] text-white shadow-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{readOnly ? "View Member" : initial ? "Edit Member" : "New Member"}</h2>
          <button onClick={onClose} className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10">✕</button>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-slate-300">S.No</span>
              <input
                type="number"
                value={sno}
                onChange={(e) => setSno(Number(e.target.value))}
                disabled={readOnly}
                className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
              />
            </label>
            <label className="md:col-span-2 grid gap-1">
              <span className="text-sm text-slate-300">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={readOnly}
                className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-slate-300">Given Date</span>
              <input
                type="date"
                value={givenDate}
                onChange={(e) => setGivenDate(e.target.value)}
                disabled={readOnly}
                className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-slate-300">Total Amount</span>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                disabled={readOnly}
                className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm text-slate-300">Interest</span>
            <input
              type="number"
              value={interest}
              onChange={(e) => setInterest(Number(e.target.value))}
              disabled={readOnly}
              className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Payments</h3>
              {!readOnly && (
                <button type="button" onClick={addPayment} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">+ Add Payment</button>
              )}
            </div>
            <div className="grid gap-2 mt-2">
              {paid.map((p, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={p.amount}
                    onChange={(e) => updatePayment(idx, { amount: Number(e.target.value) })}
                    placeholder="Amount"
                    disabled={readOnly}
                    className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
                  />
                  <input
                    type="date"
                    value={p.date.slice(0,10)}
                    onChange={(e) => updatePayment(idx, { date: e.target.value })}
                    disabled={readOnly}
                    className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 disabled:opacity-70"
                  />
                  {!readOnly && (
                    <button type="button" onClick={() => removePayment(idx)} className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-red-400">{error}</div>}

          <div className="flex gap-2 justify-end pt-1">
            <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-70">Close</button>
            {!readOnly && (
              <button onClick={onSubmit} disabled={saving} className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-70 inline-flex items-center gap-2">
                {saving ? (<><Spinner size={18} /><span>Saving...</span></>) : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
