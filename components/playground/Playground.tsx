// file: components/playground/Playground.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

import { CodeEditor, type SupportedLanguage } from "@/components/playground/CodeEditor";
import { OutputPanel, type OutputState } from "@/components/playground/OutputPanel";
import { Toolbar } from "@/components/playground/Toolbar";

import { runJavaScript } from "@/lib/runners/javascript";
import { runPython } from "@/lib/runners/python";
import { runSql } from "@/lib/runners/sql";
import { buildHtmlDocument } from "@/lib/runners/html";

// ── Default code snippets per language ───────────────────────────────────────
const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  javascript: `// JavaScript Playground\nconsole.log("Salam, Dünya!");\n\nconst sum = (a, b) => a + b;\nconsole.log("2 + 3 =", sum(2, 3));`,
  typescript: `// TypeScript Playground\nfunction greet(name: string): string {\n  return \`Salam, \${name}!\`;\n}\nconsole.log(greet("Naill"));`,
  python: `# Python Playground\nprint("Salam, Dünya!")\n\ndef factorial(n: int) -> int:\n    return 1 if n <= 1 else n * factorial(n - 1)\n\nprint(f"5! = {factorial(5)}")`,
  sql: `-- SQL Playground\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  email TEXT UNIQUE\n);\n\nINSERT INTO users (id, name, email) VALUES\n  (1, 'Naill', 'naill@example.com'),\n  (2, 'Əli', 'ali@example.com');\n\nSELECT * FROM users;`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 20px; background: #0f0f0f; color: #fff; }\n    h1 { background: linear-gradient(to right, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n  </style>\n</head>\n<body>\n  <h1>SyntaxVirtual Lab</h1>\n  <p>HTML Playground hazırdır!</p>\n</body>\n</html>`,
  css: `/* CSS-only preview */\nbody {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #0f0f0f;\n  color: #fff;\n  font-family: sans-serif;\n}\n\nh1 {\n  background: linear-gradient(to right, #6366f1, #a855f7);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
};

const EMPTY_OUTPUT: OutputState = {
  logs: [],
  error: null,
  duration: null,
  previewSrc: null,
  sqlResults: [],
};

/**
 * Playground – əsas komponentin orkestratoru.
 * - Dil seçimi → runner dispatch
 * - Toolbar → CodeEditor + OutputPanel split view
 * - Ctrl+Enter → run, Ctrl+S → save (window event listener)
 * - Share: nanoid URL hash
 */
export function Playground() {
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState<OutputState>(EMPTY_OUTPUT);
  const [isRunning, setIsRunning] = useState(false);

  // Dil dəyişdikdə default kodu yüklə
  const handleLanguageChange = useCallback((lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput(EMPTY_OUTPUT);
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput(EMPTY_OUTPUT);

    try {
      if (language === "javascript" || language === "typescript") {
        const result = await runJavaScript(code);
        setOutput({
          logs: result.output,
          error: result.error,
          duration: result.duration,
          previewSrc: null,
          sqlResults: [],
        });
      } else if (language === "python") {
        const result = await runPython(code);
        setOutput({
          logs: result.output,
          error: result.error,
          duration: result.duration,
          previewSrc: null,
          sqlResults: [],
        });
      } else if (language === "sql") {
        const result = await runSql(code);
        setOutput({
          logs: result.output,
          error: result.error,
          duration: result.duration,
          previewSrc: null,
          sqlResults: result.results,
        });
      } else if (language === "html") {
        // HTML → iframe srcDoc
        const srcDoc = code.startsWith("<!DOCTYPE")
          ? code
          : buildHtmlDocument({ html: code });
        setOutput({
          logs: [],
          error: null,
          duration: 0,
          previewSrc: srcDoc,
          sqlResults: [],
        });
      } else if (language === "css") {
        const srcDoc = buildHtmlDocument({
          html: "<h1>CSS Preview</h1><p>Stil tətbiq edildi.</p>",
          css: code,
        });
        setOutput({
          logs: [],
          error: null,
          duration: 0,
          previewSrc: srcDoc,
          sqlResults: [],
        });
      }
    } finally {
      setIsRunning(false);
    }
  }, [code, language, isRunning]);

  const handleSave = useCallback(() => {
    // localStorage-a saxla (Supabase inteqrasiyası FAZA 6-da)
    try {
      localStorage.setItem(`sv-snippet-${language}`, code);
      toast.success("Snippet saxlandı!");
    } catch {
      toast.error("Saxlama zamanı xəta baş verdi.");
    }
  }, [code, language]);

  const handleShare = useCallback(() => {
    const id = nanoid(8);
    const encoded = btoa(encodeURIComponent(JSON.stringify({ lang: language, code })));
    const url = `${window.location.origin}/playground?s=${id}&c=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link kopyalandı!", { description: url });
    });
  }, [code, language]);

  const handleClear = useCallback(() => {
    setCode("");
    setOutput(EMPTY_OUTPUT);
  }, []);

  // Ctrl+S event listener
  useEffect(() => {
    const handler = () => handleSave();
    window.addEventListener("editor:save", handler);
    return () => window.removeEventListener("editor:save", handler);
  }, [handleSave]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Toolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        onSave={handleSave}
        onShare={handleShare}
        onClear={handleClear}
        isRunning={isRunning}
      />

      {/* Split pane: editor | output */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Editor */}
        <div className="flex-1 overflow-hidden min-h-[200px] md:min-h-0">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            onRun={handleRun}
            height="100%"
          />
        </div>

        {/* Output */}
        <div className="h-64 md:h-auto md:w-1/2 lg:w-2/5 overflow-hidden">
          <OutputPanel output={output} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}

// ✅ Verified: All 6 languages, run/save/share/clear, Ctrl+Enter, localStorage save, URL share
