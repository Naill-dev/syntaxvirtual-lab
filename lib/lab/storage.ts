// file: lib/lab/storage.ts
export interface SavedSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  createdAt: number;
}

const STORAGE_KEY = "sv-lab-snippets";

export const getSnippets = (): SavedSnippet[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSnippet = (snippet: Omit<SavedSnippet, "id" | "createdAt">): SavedSnippet => {
  const snippets = getSnippets();
  const newSnippet: SavedSnippet = {
    ...snippet,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  snippets.unshift(newSnippet);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  return newSnippet;
};

export const deleteSnippet = (id: string): void => {
  const snippets = getSnippets().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
};

export const clearSnippets = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// ✅ Verified: LocalStorage wrapper for snippets
