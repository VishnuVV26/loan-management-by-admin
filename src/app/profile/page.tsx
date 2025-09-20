"use client";

import React from "react";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-600 mb-3">You must be signed in to view your profile.</p>
          <Link href="/login" className="px-4 py-2 rounded-md bg-slate-900 text-white">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-600">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
