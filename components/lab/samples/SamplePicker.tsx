// file: components/lab/samples/SamplePicker.tsx
"use client";

import { useState } from "react";
import { useLabStore, Language } from "@/stores/labStore";
import { samples, CodeSample } from "@/lib/lab/samples";
import { BookOpen, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SamplePicker() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { setLanguage, setCode, language } = useLabStore();

  const handleSelect = (s: CodeSample) => {
    setLanguage(s.language as Language);
    setTimeout(() => setCode(s.code), 50); // Store defaults override
    setOpen(false);
    toast.success("Nümunə yükləndi", { description: s.title });
  };

  const filtered = samples.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 border-indigo-500/30 hover:border-indigo-500/80 hover:bg-indigo-500/10 text-indigo-400">
          <BookOpen className="h-4 w-4" /> Nümunələr
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col bg-card border-border">
        <DialogHeader>
          <DialogTitle>Nümunə Kodlar</DialogTitle>
          <DialogDescription>
            Öyrənmək və ya test etmək üçün hazır kod nümunələrindən birini seçin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Axtar (Məs: Javascript, Array, SQL)..." 
            className="pl-9 bg-background/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Nəticə tapılmadı</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(s => (
                <div 
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className="p-4 rounded-xl border border-border bg-muted/20 hover:border-indigo-500/50 hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium group-hover:text-indigo-400 transition-colors">{s.title}</h4>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border",
                      s.language === 'javascript' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      s.language === 'python' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      s.language === 'sql' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                      {s.language}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{s.description}</p>
                  <div className="h-16 overflow-hidden rounded-md bg-background/80 p-2 relative">
                    <pre className="text-[10px] font-mono text-zinc-400">
                      {s.code}
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Verified: Sample picker dialog with search and categories
