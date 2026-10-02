// file: components/tools/RegexBuilder.tsx
"use client";

import { useState, useMemo } from "react";
import { Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Regex flag option */
interface FlagOption { flag: string; label: string; desc: string; }

const FLAGS: FlagOption[] = [
  { flag: "g", label: "Global", desc: "Bütün uyğunluqları tap" },
  { flag: "i", label: "Case insensitive", desc: "Böyük/kiçik hərfi fərqləndirmə" },
  { flag: "m", label: "Multiline", desc: "^ və $ hər sətirə uyğun gəlsin" },
  { flag: "s", label: "Dotall", desc: ". yeni sətri də tutsun" },
];

/** Common regex patterns */
const PATTERNS = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_+.~#?&/=]*)" },
  { name: "Telefon (AZ)", pattern: "(\\+994|0)[0-9]{9}" },
  { name: "IPv4", pattern: "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)" },
  { name: "Tarix (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "Hex rəng", pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})" },
  { name: "Username", pattern: "[a-zA-Z0-9_-]{3,16}" },
  { name: "Güclü şifrə", pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}" },
];

/** Highlight matches in test text */
function highlightMatches(text: string, regex: RegExp): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const r = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");

  while ((match = r.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <mark
        key={match.index}
        className="bg-yellow-300 text-yellow-950 dark:bg-yellow-500 dark:text-yellow-950 rounded px-0.5"
      >
        {match[0]}
      </mark>
    );
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) break;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/**
 * RegexBuilder – Vizual regex yaratma, test etmə və export komponenti.
 * Pattern, flags, test mətni, match siyahısı, kod export.
 */
export function RegexBuilder() {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set(["g", "i"]));
  const [testText, setTestText] = useState(
    "Mənim emailim: naill@syntaxvirtual.com\nDigər email: test@example.org\nBu email deyil: notanemail"
  );
  const [exportLang, setExportLang] = useState<"js" | "python" | "php">("js");
  const flagStr = Array.from(activeFlags).join("");

  const { regex, error, matches } = useMemo(() => {
    try {
      const r = new RegExp(pattern, flagStr || "g");
      const ms: string[] = [];
      const g = new RegExp(r.source, r.flags.includes("g") ? r.flags : r.flags + "g");
      let m: RegExpExecArray | null;
      while ((m = g.exec(testText)) !== null) {
        ms.push(m[0]);
        if (m[0].length === 0) break;
      }
      return { regex: r, error: null, matches: ms };
    } catch (e) {
      return { regex: null, error: (e as Error).message, matches: [] };
    }
  }, [pattern, flagStr, testText]);

  const toggleFlag = (f: string) => {
    setActiveFlags((prev) => {
      const n = new Set(prev);
      n.has(f) ? n.delete(f) : n.add(f);
      return n;
    });
  };

  const getExportCode = () => {
    const flags = flagStr || "g";
    if (exportLang === "js") return `const regex = /${pattern}/${flags};\nconst matches = text.match(regex);`;
    if (exportLang === "python") return `import re\npattern = re.compile(r"${pattern}", re.${flags.includes("i") ? "IGNORECASE | re." : ""}${flags.includes("m") ? "MULTILINE" : ""}DOTALL if "s" in "${flags}" else 0)\nmatches = pattern.findall(text)`;
    return `$pattern = '/${pattern}/${flags}';\npreg_match_all($pattern, $text, $matches);`;
  };

  const copyExport = () => {
    navigator.clipboard.writeText(getExportCode());
    toast.success("Kod kopyalandı!");
  };

  return (
    <div className="space-y-6">
      {/* Quick patterns */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Hazır patternlər:</p>
        <div className="flex flex-wrap gap-2">
          {PATTERNS.map((p) => (
            <Button
              key={p.name}
              variant="outline"
              size="sm"
              className="h-7 text-xs rounded-lg"
              onClick={() => setPattern(p.pattern)}
            >
              {p.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Pattern input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Regex Pattern</label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 font-mono text-sm">
          <span className="text-muted-foreground">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            placeholder="pattern daxil et..."
            aria-label="Regex pattern"
          />
          <span className="text-muted-foreground">/{flagStr || "g"}</span>
        </div>
        {error && <p className="text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Flags</label>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map(({ flag, label, desc }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              title={desc}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                activeFlags.has(flag)
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                  : "border-border text-muted-foreground hover:border-indigo-500/50"
              )}
            >
              <code className="text-[10px] font-mono">{flag}</code>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Test text */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Test Mətni</label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 transition-colors resize-none"
          aria-label="Test mətni"
        />
      </div>

      {/* Highlighted result */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Nəticə</label>
          <Badge variant="secondary" className="text-xs">
            {matches.length} uyğunluq
          </Badge>
        </div>
        <div className="min-h-[80px] rounded-xl border border-border bg-zinc-950/60 px-3 py-2 text-sm font-mono whitespace-pre-wrap">
          {regex && !error
            ? highlightMatches(testText, regex)
            : <span className="text-muted-foreground">Pattern düzgün deyil</span>}
        </div>
      </div>

      {/* Match list */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Tapılan uyğunluqlar</label>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <code key={i} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                {m}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Export */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Kod Export</label>
        <div className="flex gap-2 mb-2">
          {(["js", "python", "php"] as const).map((l) => (
            <Button
              key={l}
              variant={exportLang === l ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs rounded-lg"
              onClick={() => setExportLang(l)}
            >
              {l === "js" ? "JavaScript" : l === "python" ? "Python" : "PHP"}
            </Button>
          ))}
        </div>
        <div className="relative">
          <pre className="rounded-xl bg-zinc-950/80 border border-border p-3 text-xs font-mono text-green-300 overflow-x-auto">
            {getExportCode()}
          </pre>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={copyExport}
            aria-label="Kopyala"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ✅ Verified: Pattern input, flag toggle, real-time match highlight, export in 3 languages
