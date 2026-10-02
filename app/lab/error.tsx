// file: app/lab/error.tsx
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LabError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Lab Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-6 border border-red-500/20">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-3">
        Gözlənilməz Xəta Baş Verdi!
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Lab mühitində işləyərkən texniki bir xəta yarandı. Narahat olmayın, yazdıqlarınız brauzer yaddaşındadır (əgər &quot;Save&quot; etmisinizsə).
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={reset}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <RefreshCcw className="h-4 w-4" /> Yenidən Yoxla
        </Button>
        <Link href="/lab">
          <Button variant="outline" className="gap-2 w-full">
            <Home className="h-4 w-4" /> Lab Ana Səhifə
          </Button>
        </Link>
      </div>
      
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-12 p-4 bg-muted/50 rounded-lg text-left text-xs font-mono text-red-400 overflow-auto max-w-2xl border border-red-500/20">
          {error.message}
        </pre>
      )}
    </div>
  );
}

// ✅ Verified: Global error boundary for /lab routes
