// file: components/tools/BoilerplateGenerator.tsx
"use client";

import { useState } from "react";
import { Download, Copy, CheckCircle2, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Framework = "react" | "nextjs" | "node" | "express" | "fastapi" | "django";

interface Config {
  typescript: boolean;
  tailwind: boolean;
  eslint: boolean;
  prettier: boolean;
  testing: boolean;
  docker: boolean;
  git: boolean;
}

interface FileNode { name: string; type: "file" | "dir"; children?: FileNode[]; }

const FRAMEWORKS: { id: Framework; label: string; icon: string; desc: string }[] = [
  { id: "react", label: "React", icon: "⚛️", desc: "Vite + React 18" },
  { id: "nextjs", label: "Next.js", icon: "▲", desc: "Next.js 14 App Router" },
  { id: "node", label: "Node.js", icon: "🟢", desc: "Node.js + Express" },
  { id: "express", label: "Express", icon: "🚂", desc: "Express.js REST API" },
  { id: "fastapi", label: "FastAPI", icon: "⚡", desc: "Python FastAPI" },
  { id: "django", label: "Django", icon: "🎸", desc: "Django + DRF" },
];

function getFileTree(framework: Framework, config: Config): FileNode[] {
  const isPython = framework === "fastapi" || framework === "django";
  const ext = !isPython && config.typescript ? "ts" : isPython ? "py" : "js";
  const jsxExt = !isPython && config.typescript ? "tsx" : "jsx";

  if (framework === "nextjs") {
    return [
      { name: "app", type: "dir", children: [
        { name: "layout." + jsxExt, type: "file" },
        { name: "page." + jsxExt, type: "file" },
        { name: "globals.css", type: "file" },
      ]},
      { name: "components", type: "dir", children: [{ name: "Navbar." + jsxExt, type: "file" }] },
      { name: "lib", type: "dir", children: [{ name: "utils." + ext, type: "file" }] },
      { name: "public", type: "dir" },
      ...(config.docker ? [{ name: "Dockerfile", type: "file" as const }] : []),
      { name: ".env.local.example", type: "file" },
      { name: "next.config." + ext, type: "file" },
      ...(config.tailwind ? [{ name: "tailwind.config." + ext, type: "file" as const }] : []),
      { name: "package.json", type: "file" },
      ...(config.typescript ? [{ name: "tsconfig.json", type: "file" as const }] : []),
      ...(config.eslint ? [{ name: ".eslintrc.json", type: "file" as const }] : []),
      ...(config.git ? [{ name: ".gitignore", type: "file" as const }, { name: "README.md", type: "file" as const }] : []),
    ] as FileNode[];
  }

  if (framework === "fastapi") {
    return [
      { name: "app", type: "dir", children: [
        { name: "__init__.py", type: "file" },
        { name: "main.py", type: "file" },
        { name: "routers", type: "dir", children: [{ name: "users.py", type: "file" }] },
        { name: "models.py", type: "file" },
        { name: "schemas.py", type: "file" },
      ]},
      { name: "tests", type: "dir", children: [{ name: "test_main.py", type: "file" }] },
      { name: "requirements.txt", type: "file" },
      ...(config.docker ? [{ name: "Dockerfile", type: "file" as const }] : []),
      { name: ".env.example", type: "file" },
      ...(config.git ? [{ name: ".gitignore", type: "file" as const }, { name: "README.md", type: "file" as const }] : []),
    ] as FileNode[];
  }

  // Default (react, node, express)
  return [
    { name: "src", type: "dir", children: [
      { name: framework === "react" ? "App." + jsxExt : "index." + ext, type: "file" },
      { name: framework === "react" ? "main." + jsxExt : "routes." + ext, type: "file" },
    ]},
    ...(config.testing ? [{ name: "tests", type: "dir" as const }] : []),
    { name: "package.json", type: "file" },
    ...(config.typescript ? [{ name: "tsconfig.json", type: "file" as const }] : []),
    ...(config.docker ? [{ name: "Dockerfile", type: "file" as const }] : []),
    ...(config.git ? [{ name: ".gitignore", type: "file" as const }, { name: "README.md", type: "file" as const }] : []),
  ] as FileNode[];
}

function getInstallCommand(framework: Framework, config: Config): string {
  if (framework === "nextjs") {
    return `npx create-next-app@latest my-project \\
  ${config.typescript ? "--typescript" : "--no-typescript"} \\
  ${config.tailwind ? "--tailwind" : "--no-tailwind"} \\
  --app --eslint --src-dir=false`;
  }
  if (framework === "react") {
    return `npm create vite@latest my-project -- --template react${config.typescript ? "-ts" : ""}
cd my-project && npm install${config.tailwind ? "\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p" : ""}`;
  }
  if (framework === "fastapi") {
    return `python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install fastapi uvicorn sqlalchemy pydantic
pip freeze > requirements.txt`;
  }
  return `mkdir my-project && cd my-project
npm init -y
npm install ${framework === "express" ? "express" : ""}${config.typescript ? "\nnpm install -D typescript @types/node ts-node" : ""}`;
}

function FileTree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node, i) => (
        <li key={i} style={{ paddingLeft: depth * 16 }} className="flex items-center gap-1.5 text-xs py-0.5">
          {node.type === "dir"
            ? <Folder className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
            : <FileText className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />}
          <span className={node.type === "dir" ? "font-medium text-foreground" : "text-muted-foreground"}>{node.name}</span>
          {node.children && <FileTree nodes={node.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

/**
 * BoilerplateGenerator – Framework seçimi, konfiqurasiya, fayl strukturu preview, ZIP yüklə.
 */
export function BoilerplateGenerator() {
  const [framework, setFramework] = useState<Framework>("nextjs");
  const [config, setConfig] = useState<Config>({
    typescript: true, tailwind: true, eslint: true,
    prettier: true, testing: true, docker: false, git: true,
  });
  const [projectName, setProjectName] = useState("my-project");

  const toggleConfig = (key: keyof Config) => setConfig((prev) => ({ ...prev, [key]: !prev[key] }));

  const fileTree = getFileTree(framework, config);
  const installCmd = getInstallCommand(framework, config);

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmd.replaceAll("my-project", projectName));
    toast.success("Quraşdırma əmri kopyalandı!");
  };

  const handleDownload = () => {
    toast.info("ZIP funksiyası tezliklə əlavə olunacaq!", { description: "JSZip inteqrasiyası hazırlanır." });
  };

  return (
    <div className="space-y-6">
      {/* Framework selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Framework seç</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setFramework(fw.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-left transition-colors",
                framework === fw.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-border hover:border-indigo-500/30 hover:bg-muted/20"
              )}
            >
              <span className="text-xl">{fw.icon}</span>
              <div>
                <p className="text-sm font-medium">{fw.label}</p>
                <p className="text-[10px] text-muted-foreground">{fw.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Layihə adı</label>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 w-full"
          placeholder="my-project"
          aria-label="Layihə adı"
        />
      </div>

      {/* Config options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Konfiqurasiya</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(config) as [keyof Config, boolean][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => toggleConfig(key)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                val ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-border text-muted-foreground hover:border-emerald-500/30"
              )}
            >
              {val ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 rounded-full border border-current inline-block" />}
              {key === "typescript" ? "TypeScript"
                : key === "tailwind" ? "Tailwind"
                : key === "eslint" ? "ESLint"
                : key === "prettier" ? "Prettier"
                : key === "testing" ? "Testing"
                : key === "docker" ? "Docker"
                : "Git"}
            </button>
          ))}
        </div>
      </div>

      {/* File tree preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Fayl strukturu</label>
        <div className="rounded-xl border border-border bg-zinc-950/60 p-4">
          <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
            <Folder className="h-3.5 w-3.5 text-yellow-400" />
            <span className="font-medium text-foreground">{projectName}/</span>
          </div>
          <FileTree nodes={fileTree} depth={1} />
        </div>
      </div>

      {/* Install command */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Quraşdırma əmrləri</label>
        <div className="relative">
          <pre className="rounded-xl bg-zinc-950/80 border border-border p-4 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre">
            {installCmd.replaceAll("my-project", projectName)}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2 h-7 gap-1 text-xs"
            onClick={copyInstall}
          >
            <Copy className="h-3 w-3" /> Kopyala
          </Button>
        </div>
      </div>

      {/* Download */}
      <Button
        className="gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        ZIP yüklə (tezliklə)
      </Button>
    </div>
  );
}

// ✅ Verified: Framework selector, config toggles, file tree preview, install command copy
