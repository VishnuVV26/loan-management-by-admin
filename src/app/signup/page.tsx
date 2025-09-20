"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function SignupPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await register(email, password);
      setMessage("Registered! You can now sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0a0f1f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
        <p className="text-slate-300 text-sm mb-6">Sign up to access the dashboard.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Create a password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 text-white py-3 font-medium shadow-[0_8px_24px_-6px_rgba(2,132,199,0.6)] disabled:opacity-60">
            {loading ? "Creating..." : "Sign up"}
          </button>
          {message && <p className="text-center text-sm text-slate-300">{message}</p>}
          <p className="text-center text-sm text-slate-400">Already have an account? <Link href="/login" className="text-white hover:underline">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
