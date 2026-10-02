// file: app/tools/sql/page.tsx
import type { Metadata } from "next";
import { SqlGenerator } from "@/components/lab/tools/SqlGenerator";

export const metadata: Metadata = {
  title: "SQL Generator",
  description: "Vizual cədvəl dizayneri, SQL kodu generasiyası, brauzerdə test.",
};

export default function SqlPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">SQL Generator</h1>
        <p className="text-sm text-muted-foreground">
          Vizual cədvəl dizayneri — sütunlar, tiplər, əlaqələr, sql.js ilə brauzerdə test.
        </p>
      </div>
      <SqlGenerator />
    </div>
  );
}
