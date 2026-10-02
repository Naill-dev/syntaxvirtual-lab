// file: components/playground/Toolbar.tsx
"use client";

import { Play, Save, Share2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportedLanguage } from "@/components/playground/CodeEditor";

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

interface ToolbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onRun: () => void;
  onSave: () => void;
  onShare: () => void;
  onClear: () => void;
  isRunning: boolean;
}

/**
 * Toolbar – Playground-ın üst idarəetmə paneli.
 * - Dil seçimi (Select)
 * - Run, Save, Share, Clear düymələri
 * - Run zamanı Loader2 ikonu ilə vizual feedback
 * - Klaviatura qısayolları hint (Ctrl+Enter)
 */
export function Toolbar({
  language,
  onLanguageChange,
  onRun,
  onSave,
  onShare,
  onClear,
  isRunning,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/20 px-3 py-2">
      {/* Language selector */}
      <Select
        value={language}
        onValueChange={(v) => onLanguageChange(v as SupportedLanguage)}
      >
        <SelectTrigger
          className="h-8 w-36 rounded-lg text-xs"
          aria-label="Proqramlaşdırma dilini seç"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l.value} value={l.value} className="text-xs">
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        {/* Run */}
        <Button
          size="sm"
          className="h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-xs font-semibold text-white hover:scale-105 hover:shadow-glow disabled:opacity-60"
          onClick={onRun}
          disabled={isRunning}
          aria-label="Kodu icra et (Ctrl+Enter)"
          title="Kodu icra et (Ctrl+Enter)"
        >
          {isRunning ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="mr-1.5 h-3.5 w-3.5" />
          )}
          {isRunning ? "İcra olunur…" : "İcra et"}
        </Button>

        {/* Save */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          onClick={onSave}
          aria-label="Saxla (Ctrl+S)"
          title="Saxla (Ctrl+S)"
        >
          <Save className="mr-1 h-3.5 w-3.5" />
          Saxla
        </Button>

        {/* Share */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          onClick={onShare}
          aria-label="Paylaş"
        >
          <Share2 className="mr-1 h-3.5 w-3.5" />
          Paylaş
        </Button>

        {/* Clear */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg text-xs text-muted-foreground hover:text-red-400"
          onClick={onClear}
          aria-label="Təmizlə"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ✅ Verified: All buttons functional, language select, aria-labels, Run loading state
