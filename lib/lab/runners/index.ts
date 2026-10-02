// file: lib/lab/runners/index.ts
import { JavaScriptRunner } from "./javascript";
import { PythonRunner } from "./python";
import { SqlRunner } from "./sql";
import { HtmlRunner } from "./html";
import { Runner } from "./types";

// Singleton instance-lar ki, yaddaş və worker-lər təkrar-təkrar yaradılmasın
const runners: Record<string, Runner> = {};

export function getRunner(language: string): Runner {
  const normalizedLang = language.toLowerCase();
  
  if (!runners[normalizedLang]) {
    switch (normalizedLang) {
      case "javascript":
      case "typescript": // TS gələcəkdə sandpack və ya babel ilə compile oluna bilər, hələlik JS kimi işlədirik
        runners[normalizedLang] = new JavaScriptRunner();
        break;
      case "python":
        runners[normalizedLang] = new PythonRunner();
        break;
      case "sql":
        runners[normalizedLang] = new SqlRunner();
        break;
      case "html":
      case "css":
        runners[normalizedLang] = new HtmlRunner();
        break;
      default:
        throw new Error(`Dəstəklənməyən dil: ${language}`);
    }
  }
  
  return runners[normalizedLang];
}

// ✅ Verified: Factory pattern for getting cached runner instances
