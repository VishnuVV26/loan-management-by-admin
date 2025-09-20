"use client";

import React from "react";
import LoanTable from "@/components/loans/LoanTable";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

const HomePage = () => {
  const { user, ready } = useAuth();

  // While auth state is hydrating
  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Not logged in: split layout with left hero and right login card
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] w-full grid grid-cols-1 md:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden md:block">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1000px 600px at -10% 10%, rgba(88,28,135,0.6), transparent 60%), radial-gradient(1000px 600px at 110% 20%, rgba(59,7,100,0.7), transparent 60%), linear-gradient(135deg, #0b1020, #0a0f1f 60%, #0b1020)",
            }}
          />
          <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-10 bg-cover bg-center" />
          <div className="relative h-full w-full flex items-end p-10">
            <div className="text-white max-w-md">
              <p className="uppercase tracking-widest text-xs text-fuchsia-300">Inspired by the future</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight">The Vision UI Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Right login card */}
        <div className="bg-[#0a0f1f] text-white flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Nice to see you!</h2>
              <p className="text-slate-300 text-sm">Enter your email and password to sign in.</p>
            </div>
            <LoginForm />
            <div className="mt-8 text-center text-xs text-slate-400">
              <p>
                © 2025. Made with <span className="text-pink-400">♥</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in: dark gradient hero with quote + button to go to dashboard
  return (
    <section className="relative min-h-[calc(100vh-56px)] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 600px at -10% 10%, rgba(88,28,135,0.6), transparent 60%), radial-gradient(1000px 600px at 110% 20%, rgba(59,7,100,0.7), transparent 60%), linear-gradient(135deg, #0b1020, #0a0f1f 60%, #0b1020)",
        }}
      />
      <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-10 bg-cover bg-center" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24 text-white">
        <p className="uppercase tracking-widest text-xs text-fuchsia-300">Welcome back</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
          "Good lending is built on clarity. Track loans, payments, and balances effortlessly."
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl">
          Head to your dashboard to manage loan records, payments, and balances in real-time.
        </p>
        <div className="mt-8">
          <Link href="/dashboard" className="inline-flex items-center px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-[0_8px_24px_-6px_rgba(2,132,199,0.6)]">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;