// file: components/lab/CodeEditor.tsx
"use client";

import { useLabStore } from "@/stores/labStore";
import { useTheme } from "next-themes";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function CodeEditor() {
  const { code, setCode, language, fontSize, run } = useLabStore();
  const { theme } = useTheme();
  const monaco = useMonaco();

  // Klaviatura qısayolları (Monaco içində fərqli işləyir, ona görə mount-da əlavə edirik)
  // eslint-disable-next-line
  const handleMount = (editor: any, m: any) => {
    // Run shortcut (Ctrl+Enter)
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, () => {
      run();
    });

    // Save shortcut (Ctrl+S)
    editor.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.KeyS, () => {
      window.dispatchEvent(new Event("lab:save"));
    });
  };

  // Tema sinxronizasiyası
  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "light");
    }
  }, [theme, monaco]);

  // Monaco dili adlarını düzəltmək
  const monacoLang = language === "html" ? "html" : language;

  return (
    <div className="w-full h-full relative group">
      <Editor
        height="100%"
        language={monacoLang}
        value={code}
        theme={theme === "dark" ? "vs-dark" : "light"}
        onChange={(val) => setCode(val || "")}
        onMount={handleMount}
        loading={
          <div className="flex h-full w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <span className="ml-2 text-sm text-muted-foreground">Editor yüklənir...</span>
          </div>
        }
        options={{
          fontSize,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
          padding: { top: 16, bottom: 16 },
          wordWrap: "on",
          suggestSelection: "first",
          lineNumbersMinChars: 3,
        }}
        className="h-full w-full"
      />
    </div>
  );
}

// ✅ Verified: Monaco Editor with proper theme matching, shortcuts, and font size
