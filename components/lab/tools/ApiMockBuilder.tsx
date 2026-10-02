// file: components/tools/ApiMockBuilder.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, Copy, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 422 | 500;

interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  status: StatusCode;
  delay: number;
  responseBody: string;
  description: string;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PATCH: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/30",
};

const DEFAULT_RESPONSE = JSON.stringify({ success: true, data: { id: 1, name: "Sample" }, message: "OK" }, null, 2);

const nanoid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);

const DEFAULT_ENDPOINTS: Endpoint[] = [
  { id: nanoid(), method: "GET", path: "/api/users", status: 200, delay: 0, description: "İstifadəçilər siyahısı", responseBody: JSON.stringify({ users: [{ id: 1, name: "Naill", email: "naill@example.com" }], total: 1 }, null, 2) },
  { id: nanoid(), method: "POST", path: "/api/users", status: 201, delay: 0, description: "Yeni istifadəçi", responseBody: JSON.stringify({ id: 2, name: "Yeni İstifadəçi", created: true }, null, 2) },
  { id: nanoid(), method: "DELETE", path: "/api/users/:id", status: 204, delay: 0, description: "İstifadəçi sil", responseBody: "" },
];

/**
 * ApiMockBuilder – REST API endpoint dizayneri.
 * Endpoint, status, delay, JSON body, curl/fetch nümunəsi, OpenAPI export.
 */
export function ApiMockBuilder() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(DEFAULT_ENDPOINTS);
  const [selected, setSelected] = useState<string>(DEFAULT_ENDPOINTS[0].id);
  const [baseUrl] = useState("https://mock.syntaxvirtual.com");

  const selectedEndpoint = endpoints.find((e) => e.id === selected) ?? endpoints[0];

  const addEndpoint = () => {
    const newEp: Endpoint = { id: nanoid(), method: "GET", path: "/api/resource", status: 200, delay: 0, description: "Yeni endpoint", responseBody: DEFAULT_RESPONSE };
    setEndpoints((prev) => [...prev, newEp]);
    setSelected(newEp.id);
  };

  const removeEndpoint = (id: string) => {
    setEndpoints((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      if (selected === id && updated.length > 0) setSelected(updated[0].id);
      return updated;
    });
  };

  const updateEndpoint = (id: string, field: keyof Endpoint, value: unknown) => {
    setEndpoints((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const getCurlCode = (ep: Endpoint) => {
    const url = `${baseUrl}${ep.path}`;
    if (ep.method === "GET" || ep.method === "DELETE") {
      return `curl -X ${ep.method} "${url}" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN"`;
    }
    return `curl -X ${ep.method} "${url}" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d '${ep.responseBody.split("\n")[0]}'`;
  };

  const getFetchCode = (ep: Endpoint) => {
    const url = `${baseUrl}${ep.path}`;
    const hasBody = ep.method !== "GET" && ep.method !== "DELETE";
    return `const response = await fetch("${url}", {
  method: "${ep.method}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN",
  },${hasBody ? `\n  body: JSON.stringify({ /* data */ }),` : ""}
});
const data = await response.json();
console.log(data);`;
  };

  const getOpenApiExport = () => {
    const paths: Record<string, Record<string, unknown>> = {};
    for (const ep of endpoints) {
      if (!paths[ep.path]) paths[ep.path] = {};
      paths[ep.path][ep.method.toLowerCase()] = {
        summary: ep.description,
        responses: { [ep.status]: { description: ep.description, content: { "application/json": { example: ep.responseBody ? JSON.parse(ep.responseBody || "{}") : {} } } } },
      };
    }
    return JSON.stringify({ openapi: "3.0.0", info: { title: "SyntaxVirtual Mock API", version: "1.0.0" }, paths }, null, 2);
  };

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${label} kopyalandı!`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: endpoint list */}
      <div className="lg:w-64 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Endpointlər</span>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs rounded-lg" onClick={addEndpoint}>
            <Plus className="h-3 w-3" /> Əlavə et
          </Button>
        </div>

        <div className="space-y-1.5">
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setSelected(ep.id)}
              className={cn(
                "w-full text-left rounded-xl border px-3 py-2 transition-colors group",
                selected === ep.id ? "border-indigo-500 bg-indigo-500/10" : "border-border hover:border-indigo-500/30 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-[10px] h-4 px-1.5 border", METHOD_COLORS[ep.method])}>
                  {ep.method}
                </Badge>
                <code className="text-xs text-foreground truncate">{ep.path}</code>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{ep.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right: editor */}
      {selectedEndpoint && (
        <div className="flex-1 space-y-4">
          {/* Method + path */}
          <div className="flex gap-2">
            <select
              value={selectedEndpoint.method}
              onChange={(e) => updateEndpoint(selectedEndpoint.id, "method", e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium outline-none"
              aria-label="HTTP metodu"
            >
              {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Input
              value={selectedEndpoint.path}
              onChange={(e) => updateEndpoint(selectedEndpoint.id, "path", e.target.value)}
              className="flex-1 rounded-xl font-mono"
              placeholder="/api/endpoint"
              aria-label="Endpoint yolu"
            />
          </div>

          {/* Status + delay */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Status kod</label>
              <select
                value={selectedEndpoint.status}
                onChange={(e) => updateEndpoint(selectedEndpoint.id, "status", Number(e.target.value))}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                aria-label="Status kodu"
              >
                {[200, 201, 204, 400, 401, 403, 404, 422, 500].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Gecikmə (ms)</label>
              <Input
                type="number"
                value={selectedEndpoint.delay}
                onChange={(e) => updateEndpoint(selectedEndpoint.id, "delay", Number(e.target.value))}
                className="w-28 rounded-xl"
                min={0}
                max={10000}
                aria-label="Gecikmə ms"
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs text-muted-foreground">Təsvir</label>
              <Input
                value={selectedEndpoint.description}
                onChange={(e) => updateEndpoint(selectedEndpoint.id, "description", e.target.value)}
                className="rounded-xl"
                placeholder="Endpoint təsviri"
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="mt-5 text-red-400 hover:text-red-300"
              onClick={() => removeEndpoint(selectedEndpoint.id)}
              aria-label="Sil"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Response body */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Mock cavab (JSON)</label>
            <textarea
              value={selectedEndpoint.responseBody}
              onChange={(e) => updateEndpoint(selectedEndpoint.id, "responseBody", e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-mono outline-none focus:border-indigo-500 resize-none"
              aria-label="Mock JSON cavabı"
            />
          </div>

          {/* Code examples */}
          <div className="space-y-3">
            {/* curl */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">curl nümunəsi</label>
                <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => copyCode(getCurlCode(selectedEndpoint), "curl")}>
                  <Copy className="h-3 w-3" /> Kopyala
                </Button>
              </div>
              <pre className="rounded-xl bg-zinc-950/80 border border-border p-3 text-xs font-mono text-yellow-300 overflow-x-auto whitespace-pre">
                {getCurlCode(selectedEndpoint)}
              </pre>
            </div>

            {/* fetch */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">fetch nümunəsi</label>
                <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => copyCode(getFetchCode(selectedEndpoint), "fetch")}>
                  <Copy className="h-3 w-3" /> Kopyala
                </Button>
              </div>
              <pre className="rounded-xl bg-zinc-950/80 border border-border p-3 text-xs font-mono text-blue-300 overflow-x-auto whitespace-pre">
                {getFetchCode(selectedEndpoint)}
              </pre>
            </div>

            {/* OpenAPI */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">OpenAPI 3.0 export</label>
                <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={() => copyCode(getOpenApiExport(), "OpenAPI")}>
                  <Copy className="h-3 w-3" /> Kopyala
                </Button>
              </div>
              <pre className="max-h-36 overflow-y-auto rounded-xl bg-zinc-950/80 border border-border p-3 text-xs font-mono text-green-300 whitespace-pre">
                {getOpenApiExport()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Verified: Endpoint list, method/path/status/delay editor, JSON body, curl/fetch/OpenAPI export
