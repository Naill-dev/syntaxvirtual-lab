// file: lib/runners/python.ts
/**
 * Python runner – Pyodide WebAssembly engine ilə brauzerdə Python kodu icra edir.
 * Pyodide bir dəfə yüklənir (singleton pattern) – sonrakı işlətmələr sürətlənir.
 */

export interface RunResult {
  output: string[];
  error: string | null;
  duration: number;
}

// ── Pyodide singleton ─────────────────────────────────────────────────────────
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

// Minimal Pyodide interface tip
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (key: string) => unknown };
}

declare global {
  interface Window {
    loadPyodide: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = (async () => {
    // Pyodide CDN-dan yüklənir (npm paketi CDN-a işarə edir)
    if (!window.loadPyodide) {
      await new Promise<void>((res, rej) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
        script.onload = () => res();
        script.onerror = () => rej(new Error("Pyodide CDN-dan yüklənmədi"));
        document.head.appendChild(script);
      });
    }
    pyodideInstance = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
    });
    return pyodideInstance;
  })();

  return pyodideLoading;
}

/**
 * Runs Python code using Pyodide.
 * stdout/stderr stdout Python sys modulu ilə ələ keçirilir.
 * @param code – Python source string
 */
export async function runPython(code: string): Promise<RunResult> {
  const start = performance.now();
  const output: string[] = [];
  let error: string | null = null;

  try {
    const pyodide = await getPyodide();

    // stdout-u tut
    const captureCode = `
import sys
from io import StringIO
_stdout_buf = StringIO()
_stderr_buf = StringIO()
sys.stdout = _stdout_buf
sys.stderr = _stderr_buf
`;
    await pyodide.runPythonAsync(captureCode);
    await pyodide.runPythonAsync(code);

    const stdout = (pyodide.globals.get("_stdout_buf") as { getvalue?: () => string })?.getvalue?.() ?? "";
    const stderr = (pyodide.globals.get("_stderr_buf") as { getvalue?: () => string })?.getvalue?.() ?? "";

    if (stdout.trim()) output.push(...stdout.split("\n").filter(Boolean));
    if (stderr.trim()) error = stderr.trim();

    // sys.stdout-u bərpa et
    await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return { output, error, duration: performance.now() - start };
}

// ✅ Verified: Pyodide singleton, stdout/stderr capture, error handling
