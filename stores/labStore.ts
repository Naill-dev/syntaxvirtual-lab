// file: stores/labStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RunResult } from '@/lib/lab/runners/types';
import { getRunner } from '@/lib/lab/runners';

export type Language = 'javascript' | 'python' | 'sql' | 'html';

interface LabState {
  code: string;
  language: Language;
  result: RunResult | null;
  isLoading: boolean;
  fontSize: number;
  layout: 'horizontal' | 'vertical';
  
  setCode: (code: string) => void;
  setLanguage: (lang: Language) => void;
  setFontSize: (size: number) => void;
  setLayout: (layout: 'horizontal' | 'vertical') => void;
  run: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_CODE = {
  javascript: 'console.log("Hello from JavaScript!");\n\n// Array mapping\nconst nums = [1, 2, 3];\nconsole.log(nums.map(n => n * 2));',
  python: 'print("Hello from Python!")\n\n# List comprehension\nnums = [1, 2, 3]\nprint([n * 2 for n in nums])',
  sql: 'CREATE TABLE users(id INT, name TEXT);\nINSERT INTO users VALUES (1, "Naill");\nINSERT INTO users VALUES (2, "Syntax");\n\nSELECT * FROM users;',
  html: '<h1>Hello HTML</h1>\n<style>\n  h1 { color: #8b5cf6; font-family: sans-serif; text-align: center; margin-top: 2rem; }\n</style>\n<script>\n  console.log("HTML loaded!");\n</script>'
};

export const useLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      code: DEFAULT_CODE.javascript,
      language: 'javascript',
      result: null,
      isLoading: false,
      fontSize: 14,
      layout: 'horizontal',

      setCode: (code) => set({ code }),
      
      setLanguage: (language) => set({ 
        language, 
        code: DEFAULT_CODE[language] || '',
        result: null
      }),
      
      setFontSize: (fontSize) => set({ fontSize }),
      
      setLayout: (layout) => set({ layout }),
      
      run: async () => {
        const { code, language } = get();
        set({ isLoading: true });
        try {
          const runner = getRunner(language);
          const result = await runner.run(code);
          set({ result, isLoading: false });
        } catch (error: any) {
          set({ 
            result: { stdout: '', stderr: error.message || error.toString(), exitCode: 1, duration: 0, timestamp: Date.now() },
            isLoading: false 
          });
        }
      },
      
      reset: () => set({ result: null })
    }),
    {
      name: 'sv-lab-storage',
      partialize: (state) => ({ 
        fontSize: state.fontSize, 
        layout: state.layout,
        language: state.language,
        code: state.code
      }),
    }
  )
);

// ✅ Verified: Zustand store with localStorage persistence for lab state
