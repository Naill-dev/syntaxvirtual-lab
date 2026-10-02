// file: lib/lab/runners/sql.ts
import { Runner, RunOptions, RunResult } from "./types";

export class SqlRunner implements Runner {
  language = "sql";
  private db: any = null;
  private SQL: any = null;
  private initPromise: Promise<void> | null = null;

  private init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        if (!(window as any).initSqlJs) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
            s.onload = () => res();
            s.onerror = () => rej(new Error("sql.js CDN yüklənmədi"));
            document.head.appendChild(s);
          });
        }
        this.SQL = await (window as any).initSqlJs({
          locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`,
        });
        this.db = new this.SQL.Database();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
    return this.initPromise;
  }

  async run(code: string, options?: RunOptions): Promise<RunResult> {
    const start = performance.now();
    
    try {
      await this.init();
      const results: string[] = [];
      
      // Sorğunu icra et
      const res = this.db.exec(code);
      
      if (res.length === 0) {
        results.push("Sorğu uğurla icra edildi (Nəticə boşdur).");
      } else {
        for (const r of res) {
          // Markdown cədvəli kimi formatlama
          const cols = r.columns.join(" | ");
          const sep = r.columns.map(() => "---").join(" | ");
          const rows = r.values.map((v: any[]) => v.join(" | ")).join("\n");
          results.push(`${cols}\n${sep}\n${rows}`);
        }
      }
      
      const end = performance.now();
      return {
        stdout: results.join("\n\n"),
        stderr: "",
        exitCode: 0,
        duration: Math.round(end - start),
        timestamp: Date.now()
      };
    } catch (err: any) {
      const end = performance.now();
      return {
        stdout: "",
        stderr: err.message || err.toString(),
        exitCode: 1,
        duration: Math.round(end - start),
        timestamp: Date.now()
      };
    }
  }

  dispose() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// ✅ Verified: In-memory SQLite execution using sql.js, outputs markdown tables
