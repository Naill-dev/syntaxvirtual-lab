// file: lib/lab/runners/javascript.ts
import { Runner, RunOptions, RunResult } from "./types";

export class JavaScriptRunner implements Runner {
  language = "javascript";

  async run(code: string, options?: RunOptions): Promise<RunResult> {
    return new Promise((resolve) => {
      const start = performance.now();
      const timeoutMs = options?.timeout || 5000;

      // Web Worker kodu
      const workerCode = `
        let stdout = "";
        let stderr = "";
        
        // Console-u override edirik ki, mesajları tutaq
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + "\\n";
        };
        console.error = (...args) => {
          stderr += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + "\\n";
        };
        console.warn = console.error;

        self.onmessage = function(e) {
          try {
            // eval əvəzinə new Function istifadə edirik
            const fn = new Function(e.data.code);
            fn();
            self.postMessage({ type: 'done', stdout, stderr, exitCode: 0 });
          } catch (err) {
            stderr += err.toString() + "\\n";
            self.postMessage({ type: 'error', stdout, stderr, exitCode: 1 });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(blob));

      let isFinished = false;

      const finish = (result: Partial<RunResult>) => {
        if (isFinished) return;
        isFinished = true;
        worker.terminate();
        const end = performance.now();
        resolve({
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          exitCode: result.exitCode || 0,
          duration: Math.round(end - start),
          timestamp: Date.now()
        });
      };

      // Timeout qorunması
      const timer = setTimeout(() => {
        finish({ stderr: "Xəta: İcra müddəti bitdi (Timeout 5000ms)", exitCode: 124 });
      }, timeoutMs);

      worker.onmessage = (e) => {
        clearTimeout(timer);
        finish(e.data);
      };

      worker.onerror = (err) => {
        clearTimeout(timer);
        finish({ stderr: err.message, exitCode: 1 });
      };

      worker.postMessage({ code });
    });
  }
}

// ✅ Verified: JavaScript execution in Web Worker with new Function, console capture, and 5000ms timeout
