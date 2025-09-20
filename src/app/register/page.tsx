"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await register(email, password);
      setMessage("Registered successfully. You can now log in.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm grid gap-3">
        <h1 className="text-2xl font-semibold mb-2">Register</h1>

        <label className="grid gap-1.5">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
        </label>

        {/* No role selection needed; any authenticated user is an admin for this dashboard */}

        {message && (
          <div className={message.includes("successfully") ? "text-emerald-700" : "text-red-600"}>{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 px-3 py-2 rounded-md border-0 text-white shadow-sm ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm">
          Already have an account? <Link className="underline" href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
