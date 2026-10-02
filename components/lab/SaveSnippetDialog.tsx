// file: components/lab/SaveSnippetDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useLabStore } from "@/stores/labStore";
import { saveSnippet } from "@/lib/lab/storage";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SaveSnippetDialog() {
  const { code, language } = useLabStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const handleSave = () => setOpen(true);
    window.addEventListener("lab:save", handleSave);
    return () => window.removeEventListener("lab:save", handleSave);
  }, []);

  const handleSaveSubmit = () => {
    if (!title.trim()) {
      toast.error("Başlıq daxil edin");
      return;
    }
    saveSnippet({ title, description: desc, code, language });
    toast.success("Snippet yadda saxlanıldı", { description: "Kitabxana bölməsindən baxa bilərsiniz." });
    setOpen(false);
    setTitle("");
    setDesc("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Kodu yadda saxla</DialogTitle>
          <DialogDescription>
            Bu snippet brauzerinizin yerli yaddaşında (LocalStorage) saxlanılacaq.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Başlıq</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Məsələn: Gözəl düymə animasiyası"
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Təsvir (Opsional)</label>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Bu kod nə işə yarayır?"
              className="bg-background/50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Ləğv et</Button>
          <Button onClick={handleSaveSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">Yadda saxla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Verified: Save snippet dialog triggered by lab:save event
