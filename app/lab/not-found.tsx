// file: app/lab/not-found.tsx
import Link from "next/link";
import { Sparkles, Code2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LabNotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-8 flex items-center justify-center">
        <h1 className="text-9xl font-black text-muted/20 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          <Sparkles className="h-16 w-16" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold tracking-tight mb-3 text-foreground">
        Axtardığınız səhifə tapılmadı
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Lab daxilində belə bir alət, simulyator və ya səhifə mövcud deyil. Ola bilsin ki, link yanlışdır və ya səhifə silinib.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/lab/playground">
          <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-glow">
            <Code2 className="h-4 w-4" /> Playground-a Keç
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Ana Səhifəyə Qayıt
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ✅ Verified: 404 page for /lab routes
