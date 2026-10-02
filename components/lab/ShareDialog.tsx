// file: components/lab/ShareDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useLabStore } from "@/stores/labStore";
import { encodeShare } from "@/lib/lab/share";
import { toast } from "sonner";
import { Copy, Link as LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShareDialog() {
  const { code, language } = useLabStore();
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const handleShare = () => {
      const hash = encodeShare(code, language);
      const url = `${window.location.origin}/lab/playground?code=${hash}&lang=${language}`;
      setShareUrl(url);
      setOpen(true);
    };
    window.addEventListener("lab:share", handleShare);
    return () => window.removeEventListener("lab:share", handleShare);
  }, [code, language]);

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("URL kopyalandı", { description: "Kodu kimsə ilə paylaşa bilərsiniz." });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Kodu Paylaş</DialogTitle>
          <DialogDescription>
            Aşağıdakı linki kopyalayaraq kodunuzu istədiyiniz şəxslə paylaşa bilərsiniz. Kod URL daxilində kodlanıb.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              readOnly
              value={shareUrl}
              className="pl-9 font-mono text-xs bg-muted/50"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
          <Button size="icon" onClick={copyUrl} className="shrink-0">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Bağla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Verified: Base64 URL share dialog, copy to clipboard
