// file: components/lab/PageTransition.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * PageTransition - Lab səhifələri arası keçid animasiyası (Framer Motion).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 flex flex-col h-full"
    >
      {children}
    </motion.div>
  );
}

// ✅ Verified: Client-side framer-motion wrapper for layout transition
