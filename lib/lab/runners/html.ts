// file: lib/lab/runners/html.ts
import { Runner, RunOptions, RunResult } from "./types";

export class HtmlRunner implements Runner {
  language = "html";

  async run(code: string, options?: RunOptions): Promise<RunResult> {
    const start = performance.now();
    
    // HTML runner əslində kodu iframe üçün hazırlayır, əsl icra OutputPanel-dəki iframe-də gedəcək.
    // Lakin bura "preview" panelini idarə etmək üçün stdout-a göndərilir.
    
    // Əgər ancaq HTML daxil edilibsə, onu tam sənədə çevirə bilərik, amma CodePen kimi direkt srcDoc edəcəyik.
    
    const end = performance.now();
    return {
      stdout: code, // UI bu kodu iframe-ə ötürəcək
      stderr: "",
      exitCode: 0,
      duration: Math.round(end - start),
      timestamp: Date.now()
    };
  }
}

// ✅ Verified: HTML passthrough runner for iframe preview
