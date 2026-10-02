// file: components/shared/LabButton.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LabButtonProps {
  label?: string;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LabButton({
  label = "Lab",
  variant = "primary",
  size = "md",
  className
}: LabButtonProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    
    // Auto-remove ripple after animation
    setTimeout(() => setRipple(null), 600);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  }[size];

  const variantClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/60"
      : "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50";

  return (
    <Link
      href="/lab"
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
        sizeClasses,
        variantClasses,
        className
      )}
    >
      <span className="text-xl leading-none flex items-center h-full">⚡</span>
      <span className="leading-none">{label}</span>
      
      {/* Ripple effekti */}
      {ripple && (
        <span
          className="absolute rounded-full bg-white/40 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      )}
    </Link>
  );
}

// ✅ Verified: Client side LabButton with ripple, gradients, accessible Link component
