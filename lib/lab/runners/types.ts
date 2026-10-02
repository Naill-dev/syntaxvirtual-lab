// file: lib/lab/runners/types.ts
export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  timestamp: number;
}

export interface Runner {
  language: string;
  run: (code: string, options?: RunOptions) => Promise<RunResult>;
  dispose?: () => void;
}

export interface RunOptions {
  timeout?: number;
  stdin?: string;
}

// ✅ Verified: Type definitions for generic language runners
