"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-slate-300">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-[#0f172a] border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Your email address"
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
          placeholder="Your password"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-400">
          <input type="checkbox" className="rounded border-white/20 bg-transparent" />
          Remember me
        </label>
        <a href="#" className="text-sm text-slate-300 hover:text-white">Forgot password?</a>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 text-white py-3 font-medium shadow-[0_8px_24px_-6px_rgba(2,132,199,0.6)] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-400">
        Don't have an account? <a href="/signup" className="text-white hover:underline">Sign up</a>
      </p>
    </form>
  );
}
