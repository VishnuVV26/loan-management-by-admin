"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import React, { useState } from "react";
import Image from "next/image";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-app" style={{ backdropFilter: "blur(8px)" }}>
      <div className="mx-auto max-w-7xl px-3 md:px-6 h-14 flex items-center justify-between text-foreground">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-wide">
            <Image src="/logo.jpg" alt="Loan Management admin logo" width={28} height={28} className="rounded-full" />
            <span className="">Loan Management admin</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <HeaderLink href="/dashboard" label="Dashboard" />
              <HeaderLink href="/profile" label="Profile" />
              <HeaderLink href="/signup" label="Signup" />
              {/* <FreeDownloadButton href="#" /> */}
              <button onClick={logout} className="ml-2 text-xs font-medium px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800">
                Logout
              </button>
            </>
          ) : (
            <>
              <HeaderLink href="/" label="Home" />
              <HeaderLink href="/signup" label="Signup" />
              <HeaderLink href="/login" label="Sign in" />
              {/* <FreeDownloadButton href="#" /> */}
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button aria-label="Menu" className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md bg-slate-800 text-white border border-white/10" onClick={() => setOpen((v) => !v)}>
          <span className="i-lucide-menu">≡</span>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0f1f] text-foreground">
          <div className="px-4 py-3 grid gap-1">
            {user ? (
              <>
                <MobileLink onClick={() => setOpen(false)} href="/dashboard" label="Dashboard" />
                <MobileLink onClick={() => setOpen(false)} href="/profile" label="Profile" />
                <MobileLink onClick={() => setOpen(false)} href="/signup" label="Signup" />
                {/* <a href="/app.apk" download className="text-[14px] px-3 py-2 rounded-md bg-sky-500 text-white text-center">Free Download</a> */}
                <button onClick={() => { setOpen(false); logout(); }} className="text-[14px] px-3 py-2 rounded-md bg-slate-800 text-white text-center">Logout</button>
              </>
            ) : (
              <>
                <MobileLink onClick={() => setOpen(false)} href="/" label="Home" />
                <MobileLink onClick={() => setOpen(false)} href="/signup" label="Signup" />
                <MobileLink onClick={() => setOpen(false)} href="/login" label="Sign in" />
                {/* <a href="/app.apk" download className="text-[14px] px-3 py-2 rounded-md bg-sky-500 text-white text-center">Free Download</a> */}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[13px] px-3 py-1.5 rounded-md text-foreground/90 hover:text-white hover:bg-white/10"
    >
      {label}
    </Link>
  );
}

function FreeDownloadButton({ href }: { href: string }) {
  return (
    <a
      href="/app.apk"
      download
      className="text-[13px] px-4 py-1.5 rounded-lg bg-sky-500 text-white shadow-[0_8px_24px_-6px_rgba(2,132,199,0.6)] hover:bg-sky-600"
    >
      Free Download
    </a>
  );
}

function MobileLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-[14px] px-3 py-2 rounded-md hover:bg-white/10">
      {label}
    </Link>
  );
}
