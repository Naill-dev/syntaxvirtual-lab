// file: app/tools/api-mock/page.tsx
import type { Metadata } from "next";
import { ApiMockBuilder } from "@/components/lab/tools/ApiMockBuilder";

export const metadata: Metadata = {
  title: "API Mock Builder",
  description: "REST endpoint dizayneri, JSON body, curl/fetch/OpenAPI export.",
};

export default function ApiMockPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">API Mock Builder</h1>
        <p className="text-sm text-muted-foreground">
          REST endpointlər dizayn et, JSON cavabları yaz, curl/fetch/OpenAPI kodu al.
        </p>
      </div>
      <ApiMockBuilder />
    </div>
  );
}
