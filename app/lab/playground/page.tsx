// file: app/lab/playground/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Toolbar } from "@/components/lab/Toolbar";
import { SplitPane } from "@/components/lab/SplitPane";
import { CodeEditor } from "@/components/lab/CodeEditor";
import { OutputPanel } from "@/components/lab/OutputPanel";
import { useLabStore, Language } from "@/stores/labStore";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function PlaygroundContent() {
  const { layout, run, setCode, setLanguage } = useLabStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Global Run and Save shortcuts
  useKeyboardShortcut("Enter", true, () => {
    run();
  });
  
  useKeyboardShortcut("s", true, () => {
    window.dispatchEvent(new Event("lab:save"));
    toast.success("Kod yadda saxlanıldı");
  });

  // Handle URL share links (?code=base64&lang=js)
  useEffect(() => {
    setMounted(true);
    
    const sharedCode = searchParams.get("code");
    const sharedLang = searchParams.get("lang");
    
    if (sharedCode && sharedLang) {
      try {
        // Handle encoded JSON payload from new encodeShare format
        let decoded = "";
        try {
           const parsed = JSON.parse(decodeURIComponent(atob(sharedCode)));
           decoded = parsed.code;
        } catch {
           decoded = atob(sharedCode); // fallback for old format
        }
        setLanguage((sharedLang as Language) || "javascript");
        setTimeout(() => setCode(decoded), 50); // Store setLanguage defaults-unu əzməmək üçün
        toast.info("Paylaşılan kod yükləndi");
      } catch (e) {
        toast.error("Paylaşım linki xətalıdır");
      }
    }
  }, [searchParams, setCode, setLanguage]);

  // SSR vaxtı hydration mismatch olmaması üçün
  if (!mounted) return <div className="flex-1 bg-background" />;

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <Toolbar />
      <div className="flex-1 overflow-hidden relative">
        <SplitPane direction={layout}>
          {/* Sol/Üst: Redaktor */}
          <div className="h-full w-full relative">
            <CodeEditor />
          </div>
          
          {/* Sağ/Alt: Nəticə */}
          <div className="h-full w-full relative border-t md:border-t-0 md:border-l border-border">
            <OutputPanel />
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <React.Suspense fallback={<div className="flex-1 h-full bg-background flex items-center justify-center text-muted-foreground">Yüklənir...</div>}>
      <PlaygroundContent />
    </React.Suspense>
  );
}

// ✅ Verified: Main Playground orchestrator integrating Toolbar, SplitPane, CodeEditor, OutputPanel. URL base64 loading supported. Suspense boundary added.
