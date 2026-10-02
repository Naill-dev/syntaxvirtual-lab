// file: components/lab/OutputPanel.tsx
"use client";

import { useState } from "react";
import { useLabStore } from "@/stores/labStore";
import { Terminal, LayoutPanelTop, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function OutputPanel() {
  const { result, language } = useLabStore();
  const [activeTab, setActiveTab] = useState<"console" | "preview">("console");

  const hasError = result && (result.exitCode !== 0 || result.stderr);

  // Əgər dil HTMLdirsə və error yoxdursa, default olaraq Preview tabına keçə bilərik, amma istifadəçi seçimini yadda saxlamaq daha yaxşıdır.
  const isHtml = language === "html";
  const currentTab = isHtml ? activeTab : "console"; // Əgər HTML deyilsə həmişə console

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-50 font-mono text-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-2 h-10 shrink-0">
        <div className="flex items-center h-full">
          <button
            onClick={() => setActiveTab("console")}
            className={cn(
              "flex items-center gap-2 h-full px-4 text-xs font-medium border-b-2 transition-colors",
              currentTab === "console" 
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10" 
                : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            )}
          >
            <Terminal className="h-3.5 w-3.5" /> Konsol
          </button>
          
          {isHtml && (
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex items-center gap-2 h-full px-4 text-xs font-medium border-b-2 transition-colors",
                currentTab === "preview" 
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/10" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <LayoutPanelTop className="h-3.5 w-3.5" /> Nəticə (Preview)
            </button>
          )}
          
          {hasError && (
            <div className="flex items-center gap-1.5 px-4 text-xs text-red-400 animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" /> Xəta
            </div>
          )}
        </div>
        
        {/* Execution time */}
        {result && (
          <div className="flex items-center gap-1.5 px-4 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{result.duration} ms</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative">
        {currentTab === "preview" && isHtml ? (
          <iframe
            title="Preview"
            srcDoc={result?.stdout || "<div style='font-family:sans-serif;padding:20px;color:#888;'>Run (Ctrl+Enter) düyməsinə basaraq nəticəni görün.</div>"}
            className="w-full h-full bg-white border-0"
            sandbox="allow-scripts allow-modals allow-same-origin"
          />
        ) : (
          <div className="p-4 space-y-4">
            {!result && (
              <div className="text-zinc-600 italic flex h-full items-center justify-center">
                Kodun çıxışı burada göstəriləcək. İcra etmək üçün &quot;Run&quot; düyməsini basın.
              </div>
            )}
            
            {result?.stdout && (
              <pre className="whitespace-pre-wrap text-zinc-300 font-mono text-sm leading-relaxed">
                {result.stdout}
              </pre>
            )}
            
            {result?.stderr && (
              <pre className="whitespace-pre-wrap text-red-400 font-mono text-sm leading-relaxed border-l-2 border-red-500 pl-3">
                {result.stderr}
              </pre>
            )}
            
            {result && !result.stdout && !result.stderr && (
              <span className="text-zinc-500 italic">Proqram bitdi (heç bir çıxış yoxdur).</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Verified: Console/Preview tabs, HTML iframe injection, stderr styling, execution duration badge
