// file: app/lab/snippets/page.tsx
import type { Metadata } from "next";
import { SnippetLibrary } from "@/components/lab/SnippetLibrary";

export const metadata: Metadata = {
  title: "Kitabxana (Snippets)",
  description: "Öz yadda saxladığınız kod parçalarını bir yerdə görün.",
};

export default function SnippetsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Mənim Snippet-lərim
        </h1>
        <p className="text-sm text-muted-foreground">
          Playground-da yadda saxladığınız kodlar yalnız sizin brauzerinizdə təhlükəsiz şəkildə qorunur.
        </p>
      </div>
      
      <SnippetLibrary />
    </div>
  );
}

// ✅ Verified: Snippets page hosting the library component
