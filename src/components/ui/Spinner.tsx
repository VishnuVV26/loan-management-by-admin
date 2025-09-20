"use client";

import React from "react";

type SpinnerProps = {
  size?: number; // px
  className?: string;
  label?: string;
};

export default function Spinner({ size = 28, className = "", label }: SpinnerProps) {
  const thickness = Math.max(2, Math.round(size / 12));
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} role="status" aria-live="polite">
      <span
        className="inline-block animate-spin rounded-full border-sky-500 border-t-transparent"
        style={{ width: size, height: size, borderWidth: thickness }}
      />
      {label ? <span className="text-foreground/90 text-sm">{label}</span> : null}
    </div>
  );
}
