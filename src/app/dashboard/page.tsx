"use client";

import React from "react";
import LoanTable from "@/components/loans/LoanTable";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

export default function DashboardPage() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Spinner size={34} label="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-600 mb-3">Please sign in to view the dashboard.</p>
          <Link href="/login" className="px-4 py-2 rounded-md bg-slate-900 text-white">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Link href="/" className="text-sm bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700">Go to Home</Link>
      </div>
      <LoanTable />
    </div>
  );
}
