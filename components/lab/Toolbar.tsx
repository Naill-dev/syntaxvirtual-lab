// file: components/lab/Toolbar.tsx
"use client";

import { useLabStore, Language } from "@/stores/labStore";
import { Play, Save, Share2, Trash2, LayoutTemplate, Type, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SamplePicker } from "@/components/lab/samples/SamplePicker";

const languages: { id: Language; label: string; icon: string; color: string }[] = [
  { id: "javascript", label: "JavaScript", icon: "JS", color: "text-yellow-400" },
  { id: "python", label: "Python", icon: "PY", color: "text-blue-400" },
  { id: "sql", label: "SQL", icon: "SQL", color: "text-purple-400" },
  { id: "html", label: "HTML/CSS", icon: "HTML", color: "text-orange-400" },
];

export function Toolbar() {
  const { language, setLanguage, run, isLoading, reset, layout, setLayout, fontSize, setFontSize } = useLabStore();

  const handleSave = () => {
    // LocalStorage-a snippet kimi saxlamaq üçün hadisə göndərə bilərik
    window.dispatchEvent(new Event("lab:save"));
    toast.success("Kod yadda saxlanıldı", { description: "Snippet olaraq brauzerdə qeyd edildi." });
  };

  const handleShare = () => {
    // URL hash olaraq kod paylaşımı üçün event
    window.dispatchEvent(new Event("lab:share"));
  };

  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-muted text-sm font-medium rounded-lg px-3 py-1.5 outline-none border border-border focus:border-indigo-500 cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>

        <SamplePicker />

        <div className="h-4 w-px bg-border mx-2" />

        <Button
          onClick={run}
          disabled={isLoading}
          className="h-8 gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          <span className="font-semibold">{isLoading ? "İcra edilir..." : "Run (Ctrl+Enter)"}</span>
        </Button>

        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleShare} title="Paylaş">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground" 
          onClick={() => setFontSize(fontSize === 14 ? 16 : fontSize === 16 ? 18 : 14)} 
          title={`Font ölçüsü: ${fontSize}px`}
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground" 
          onClick={() => setLayout(layout === "horizontal" ? "vertical" : "horizontal")}
          title="Layout dəyiş"
        >
          <LayoutTemplate className={cn("h-4 w-4", layout === "vertical" ? "rotate-90" : "")} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={reset} title="Nəticəni təmizlə">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ✅ Verified: Toolbar with language select, run button, save, share, layout and font size toggles
