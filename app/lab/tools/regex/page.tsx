// file: app/tools/regex/page.tsx
import type { Metadata } from "next";
import { RegexBuilder } from "@/components/lab/tools/RegexBuilder";

export const metadata: Metadata = {
  title: "Regex Generator",
  description: "Vizual regex pattern builder, test etmə, JS/Python/PHP export.",
};

export default function RegexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Regex Generator</h1>
        <p className="text-sm text-muted-foreground">
          Vizual pattern builder, real-time match highlighting, kod export.
        </p>
      </div>
      <RegexBuilder />
    </div>
  );
}
