// file: lib/lab/runners/python.ts
import { Runner, RunOptions, RunResult } from "./types";

export class PythonRunner implements Runner {
  language = "python";
  private worker: Worker | null = null;
  private isReady = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.init(); // Background-da yükləməyə başla
  }

  private init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const workerCode = `
        self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");
        
        let pyodide = null;
        
        async function initPyodide() {
          pyodide = await loadPyodide();
          self.postMessage({ type: 'ready' });
        }
        
        initPyodide().catch(err => self.postMessage({ type: 'init_error', error: err.toString() }));
        
        self.onmessage = async (e) => {
          if (e.data.type === 'run') {
            let stdout = "";
            let stderr = "";
            
            try {
              pyodide.setStdout({ batched: (msg) => { stdout += msg + "\\n"; } });
              pyodide.setStderr({ batched: (msg) => { stderr += msg + "\\n"; } });
              
              await pyodide.runPythonAsync(e.data.code);
              
              self.postMessage({ type: 'done', stdout, stderr, exitCode: 0, id: e.data.id });
            } catch (err) {
              stderr += err.toString() + "\\n";
              self.postMessage({ type: 'error', stdout, stderr, exitCode: 1, id: e.data.id });
            }
          }
        };
      `;
      const blob = new Blob([workerCode], { type: "application/javascript" });
      this.worker = new Worker(URL.createObjectURL(blob));
      
      this.worker.onmessage = (e) => {
        if (e.data.type === 'ready') {
          this.isReady = true;
          resolve();
        } else if (e.data.type === 'init_error') {
          reject(new Error(e.data.error));
        }
      };
    });
    
    return this.initPromise;
  }

  async run(code: string, options?: RunOptions): Promise<RunResult> {
    const start = performance.now();
    await this.init(); // Gözlə ki yüklənsin
    
    return new Promise((resolve) => {
      const id = Math.random().toString(36);
      const timeoutMs = options?.timeout || 15000; // Python bir az vaxt apara bilər
      
      let isFinished = false;
      
      const finish = (result: Partial<RunResult>) => {
        if (isFinished) return;
        isFinished = true;
        const end = performance.now();
        resolve({
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          exitCode: result.exitCode || 0,
          duration: Math.round(end - start),
          timestamp: Date.now()
        });
      };
      
      const timer = setTimeout(() => {
        // Çox uzun çəkərsə worker-i öldürüb yenidən yaradırıq
        this.worker?.terminate();
        this.worker = null;
        this.initPromise = null;
        this.isReady = false;
        finish({ stderr: "Xəta: İcra müddəti bitdi (Timeout)", exitCode: 124 });
      }, timeoutMs);
      
      const messageHandler = (e: MessageEvent) => {
        if (e.data.id === id) {
          clearTimeout(timer);
          this.worker?.removeEventListener('message', messageHandler);
          finish(e.data);
        }
      };
      
      this.worker?.addEventListener('message', messageHandler);
      this.worker?.postMessage({ type: 'run', code, id });
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.initPromise = null;
    this.isReady = false;
  }
}

// ✅ Verified: Pyodide execution in Web Worker, asynchronous loading, standard output capture
