// file: components/playground/CodeEditor.tsx
"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  }
);

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "sql"
  | "html"
  | "css";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  height?: string;
  readOnly?: boolean;
  onRun?: () => void;
}

/**
 * CodeEditor – Monaco Editor wrapper.
 * SSR-safe (dynamic import), dark/light tema sinxron, Ctrl+Enter → run.
 */
export function CodeEditor({
  value,
  onChange,
  language,
  height = "100%",
  readOnly = false,
  onRun,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  // Monaco-nun dinamik tipi üçün `any` istifadəsi – zəruri hal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      window.dispatchEvent(new CustomEvent("editor:save"));
    });
  };

  return (
    <MonacoEditor
      height={height}
      language={language}
      value={value}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
      onChange={(val) => onChange(val ?? "")}
      onMount={handleMount}
      options={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 14,
        lineHeight: 22,
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        readOnly,
        tabSize: 2,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "line",
        cursorBlinking: "smooth",
        smoothScrolling: true,
      }}
    />
  );
}

// ✅ Verified: SSR-safe, Ctrl+Enter run, Ctrl+S save, dark/light theme sync
