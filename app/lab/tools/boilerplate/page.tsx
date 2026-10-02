// file: app/tools/boilerplate/page.tsx
import type { Metadata } from "next";
import { BoilerplateGenerator } from "@/components/lab/tools/BoilerplateGenerator";

export const metadata: Metadata = {
  title: "Boilerplate Generator",
  description: "React, Next.js, Node, FastAPI, Django layihə şablonları.",
};

export default function BoilerplatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Boilerplate Generator</h1>
        <p className="text-sm text-muted-foreground">
          Framework seç, konfigurasiya et, quraşdırma əmrlərini al.
        </p>
      </div>
      <BoilerplateGenerator />
    </div>
  );
}
