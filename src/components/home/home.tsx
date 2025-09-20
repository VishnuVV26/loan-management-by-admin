"use client";

import React from "react";
import LoanTable from "@/components/loans/LoanTable";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

const HomePage = () => {
  const { user, ready } = useAuth();

  // While auth state is hydrating
  if (!ready) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Not logged in: show prompt to login
  if (!user) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div style={{ textAlign: "center", display: "grid", gap: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Login to go to Dashboard</h1>
          <p style={{ color: "#6b7280" }}>Please sign in to access the admin dashboard and manage loans.</p>
          <div>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 8,
                background: "#111827",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,.12)",
              }}
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in: show dashboard table
  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
      </div>
      <LoanTable />
    </div>
  );
};

export default HomePage;