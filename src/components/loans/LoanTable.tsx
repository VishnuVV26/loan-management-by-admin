"use client";

import { useEffect, useMemo, useState } from "react";
import type { Loan } from "@/lib/loans";
import EditLoanModal from "./EditLoanModal";
import { useToast } from "@/components/ui/Toaster";
import { useConfirm } from "@/components/ui/Confirm";

type ApiListResponse = {
  success: boolean;
  data: Loan[];
  message?: string;
};

type LoanRow = Loan & {
  totalPaid: number;
  balance: number;
  paidInfo: string;
};

export default function LoanTable() {
  // Admin dashboard: always allow editing in UI (server still enforces auth)
  const canEdit = true;
  const { show } = useToast();
  const confirm = useConfirm();

  const [items, setItems] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Loan | null>(null);
  const [viewOnly, setViewOnly] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/loans", { cache: "no-store" });
      const data: ApiListResponse = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load");
      setItems(data.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onNew = () => {
    setEditing(null);
    setViewOnly(false);
    setModalOpen(true);
  };
  const onEdit = (loan: Loan) => {
    setEditing(loan);
    setViewOnly(false);
    setModalOpen(true);
  };
  const onView = (loan: Loan) => {
    setEditing(loan);
    setViewOnly(true);
    setModalOpen(true);
  };
  const onSaved = (loan: Loan) => {
    // Merge into list
    setItems((prev) => {
      const idx = prev.findIndex((x) => x._id === loan._id);
      if (idx === -1) return [...prev, loan].sort((a, b) => a.sno - b.sno);
      const copy = [...prev];
      copy[idx] = loan;
      return copy.sort((a, b) => a.sno - b.sno);
    });
  };
  const onDelete = async (loan: Loan) => {
    if (!loan._id) return;
    show("warning", "You are about to delete this record.");
    const ok = await confirm({
      title: "Delete loan?",
      description: "Are you sure you want to delete this record? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/loans/${loan._id}`, { method: "DELETE" });
      if (res.status === 401 || res.status === 403) {
        show("error", "Not authorized. Please login and try again.");
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Delete failed");
      setItems((prev) => prev.filter((x) => x._id !== loan._id));
      show("success", "Record deleted successfully.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      show("error", msg);
    }
  };

  const rows = useMemo(() => {
    return items.map<LoanRow>((l) => {
      const totalPaid = (l.paid || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
      const balance = Math.max(0, (Number(l.totalAmount) || 0) + (Number(l.interest) || 0) - totalPaid);
      const paidInfo = (l.paid || [])
        .map((p) => `${p.amount} (${new Date(p.date).toLocaleDateString()})`)
        .join(", ");
      return { ...l, totalPaid, balance, paidInfo };
    });
  }, [items]);

  return (
    <div className="w-full md:p-3 flex flex-col gap-4 justify-center items-center">
      <div className="flex items-center justify-between mb-3 w-full">
        {/* <h2 className="text-lg font-semibold">Loans</h2> */}
        {canEdit && (
          <button onClick={onNew} className="px-3 py-2 rounded-md border-0 bg-gray-900 text-white cursor-pointer shadow-sm hover:bg-gray-800">
            + New Member
          </button>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="w-full overflow-x-auto [webkit-overflow-scrolling:touch]">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/10 bg-white/5 shadow-[0_2px_0_0_rgba(255,255,255,0.06)]">
              <tr>
                <Th>S.No</Th>
                <Th>Name</Th>
                <Th>Date Given</Th>
                <Th>Total Amount</Th>
                <Th>Interest</Th>
                <Th>Paid (amount on date)</Th>
                <Th>Total Paid</Th>
                <Th>Balance</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: LoanRow, idx: number) => (
                <tr key={r._id || r.sno} className={idx % 2 === 0 ? "bg-white/0" : "bg-white/[0.02]"}>
                  <Td>{r.sno}</Td>
                  <Td>{r.name}</Td>
                  <Td>{new Date(r.givenDate).toLocaleDateString()}</Td>
                  <Td>{r.totalAmount}</Td>
                  <Td>{r.interest}</Td>
                  <Td>{r.paidInfo || "-"}</Td>
                  <Td>{r.totalPaid}</Td>
                  <Td>{r.balance}</Td>
                  <Td>
                    <IconButton label="View" blue onClick={() => onView(r)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </IconButton>
                    <IconButton label="Edit" green onClick={() => onEdit(r)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/></svg>
                    </IconButton>
                    <IconButton label="Delete" danger onClick={() => onDelete(r)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </IconButton>
                  </Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <Td colSpan={canEdit ? 9 : 8} className="text-center p-4">No data</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditLoanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={onSaved}
        initial={editing}
        readOnly={viewOnly}
      />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left border-b border-white/10 px-2 py-3 font-semibold text-[12px] md:text-[13px] text-foreground">{children}</th>
  );
}

function Td({ children, colSpan, style, className }: { children: React.ReactNode; colSpan?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <td colSpan={colSpan} style={style} className={`border-b border-white/10 px-2 py-3 text-[12px] md:text-[13px] text-foreground ${className || ""}`}>{children}</td>
  );
}

function IconButton({ label, onClick, children, danger,green,blue }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean, green?: boolean, blue?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={
        `px-2 py-1.5 rounded-md mr-2 mb-1 cursor-pointer shadow ${
          danger
            ? "bg-red-500 text-white shadow-red-200 hover:bg-red-600"
            : green
              ? "bg-green-500 text-white shadow-green-200 hover:bg-green-600"
              : blue
                ? "bg-blue-500 text-white shadow-blue-200 hover:bg-blue-600"
                : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
        }`
      }
    >
      {children}
    </button>
  );
}
