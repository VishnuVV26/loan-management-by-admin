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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={onSubmit} style={{ width: 360, display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Register</h1>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </label>

        {/* No role selection needed; any authenticated user is an admin for this dashboard */}

        {message && (
          <div style={{ color: message.includes("successfully") ? "#065f46" : "#b00020" }}>{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            padding: 10,
            borderRadius: 6,
            border: 0,
            background: loading ? "#9aa0a6" : "#111827",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p style={{ fontSize: 14 }}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
