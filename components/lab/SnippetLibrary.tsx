// file: components/lab/SnippetLibrary.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLabStore } from "@/stores/labStore";
import { getSnippets, deleteSnippet, SavedSnippet } from "@/lib/lab/storage";
import { Code2, Trash2, ExternalLink, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { encodeShare } from "@/lib/lab/share";
import { cn } from "@/lib/utils";

export function SnippetLibrary() {
  const [snippets, setSnippets] = useState<SavedSnippet[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { setCode, setLanguage } = useLabStore();

  const load = () => setSnippets(getSnippets());
  useEffect(() => load(), []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSnippet(id);
    load();
    toast.info("Snippet silindi");
  };

  const openSnippet = (s: SavedSnippet) => {
    // URL ilə açaq ki, history-də qalsın
    const hash = encodeShare(s.code, s.language);
    router.push(`/lab/playground?code=${hash}&lang=${s.language}`);
  };

  const filtered = snippets.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Snippet axtar..." 
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Cəmi: <span className="font-medium text-foreground">{filtered.length}</span> snippet
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl border-dashed bg-card/50">
          <Code2 className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <p className="text-lg font-medium">Snippet tapılmadı</p>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Hələ heç bir kod yadda saxlamamısınız və ya axtarışa uyğun nəticə yoxdur.
            Playground-da kodu yazıb &quot;Save&quot; (və ya Ctrl+S) edə bilərsiniz.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.push('/lab/playground')}>
            Playground-a keç
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div 
              key={s.id} 
              onClick={() => openSnippet(s)}
              className="group flex flex-col justify-between p-5 rounded-xl border border-border bg-card hover:border-indigo-500/50 hover:shadow-glow cursor-pointer transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{s.title}</h3>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 border",
                    s.language === 'javascript' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                    s.language === 'python' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    s.language === 'sql' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                    "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  )}>
                    {s.language}
                  </span>
                </div>
                {s.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                )}
                
                <div className="pt-2">
                  <pre className="text-xs bg-muted/50 p-2 rounded-md font-mono text-muted-foreground overflow-hidden h-16 relative">
                    {s.code}
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-muted/50 to-transparent" />
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(s.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={(e) => handleDelete(s.id, e)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Verified: LocalStorage snippets library, visual cards, deletion, open in playground
