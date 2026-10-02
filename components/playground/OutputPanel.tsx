// file: components/playground/OutputPanel.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Terminal, AlertTriangle, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OutputState {
  logs: string[];
  error: string | null;
  duration: number | null;
  /** HTML preview content (srcDoc) */
  previewSrc: string | null;
  /** SQL table results */
  sqlResults: { columns: string[]; rows: (string | number | null)[][] }[];
}

interface OutputPanelProps {
  output: OutputState;
  isRunning: boolean;
}

/**
 * OutputPanel – 3 tab-lı çıxış paneli:
 * - Console: stdout/stderr logları
 * - Preview: HTML iframe canlı görüntüsü
 * - Errors: xəta mesajları
 */
export function OutputPanel({ output, isRunning }: OutputPanelProps) {
  const hasError = !!output.error;
  const hasPreview = !!output.previewSrc;
  const hasSql = output.sqlResults.length > 0;

  return (
    <div className="flex h-full flex-col border-t md:border-t-0 md:border-l border-border">
      <Tabs defaultValue="console" className="flex flex-1 flex-col">
        {/* Tab bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-2">
          <TabsList className="h-9 bg-transparent gap-1">
            <TabsTrigger value="console" className="flex items-center gap-1.5 text-xs h-8">
              <Terminal className="h-3.5 w-3.5" />
              Konsol
              {output.logs.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {output.logs.length}
                </Badge>
              )}
            </TabsTrigger>

            {hasPreview && (
              <TabsTrigger value="preview" className="flex items-center gap-1.5 text-xs h-8">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            )}

            <TabsTrigger value="errors" className={cn("flex items-center gap-1.5 text-xs h-8", hasError && "text-red-400")}>
              <AlertTriangle className="h-3.5 w-3.5" />
              Xəta
              {hasError && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />}
            </TabsTrigger>
          </TabsList>

          {/* Execution time */}
          {output.duration !== null && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground pr-2">
              <Clock className="h-3 w-3" />
              {output.duration.toFixed(1)}ms
            </span>
          )}
        </div>

        {/* Console tab */}
        <TabsContent value="console" className="flex-1 overflow-y-auto m-0 p-0">
          <div className="h-full bg-zinc-950/90 p-3 font-mono text-xs">
            {isRunning && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                İcra olunur…
              </div>
            )}
            {output.logs.length === 0 && !isRunning && (
              <p className="text-muted-foreground italic">Heç bir çıxış yoxdur. Kodu icra edin.</p>
            )}
            {output.logs.map((log, i) => (
              <div key={i} className="py-0.5 text-green-300 whitespace-pre-wrap break-words">
                <span className="text-muted-foreground mr-2 select-none">&gt;</span>
                {log}
              </div>
            ))}

            {/* SQL table results inline in console */}
            {hasSql && output.sqlResults.map((res, ri) => (
              <div key={ri} className="mt-3 overflow-x-auto">
                <table className="text-[11px] border-collapse">
                  <thead>
                    <tr>
                      {res.columns.map((c) => (
                        <th key={c} className="border border-border px-2 py-1 text-indigo-300 text-left font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {res.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/5">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="border border-border px-2 py-1 text-foreground">
                            {cell === null ? <span className="text-muted-foreground italic">NULL</span> : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Preview tab (HTML only) */}
        {hasPreview && (
          <TabsContent value="preview" className="flex-1 m-0 p-0">
            <iframe
              srcDoc={output.previewSrc ?? ""}
              sandbox="allow-scripts allow-modals"
              className="h-full w-full border-0 bg-white"
              title="HTML Preview"
            />
          </TabsContent>
        )}

        {/* Errors tab */}
        <TabsContent value="errors" className="flex-1 overflow-y-auto m-0 p-0">
          <div className="h-full bg-zinc-950/90 p-3 font-mono text-xs">
            {!hasError ? (
              <p className="text-emerald-400 italic">✓ Heç bir xəta yoxdur.</p>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-red-400">
                <span className="text-red-500 font-bold">Xəta: </span>
                {output.error}
              </pre>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ✅ Verified: Console, Preview iframe, Errors tab, SQL table, execution time badge
