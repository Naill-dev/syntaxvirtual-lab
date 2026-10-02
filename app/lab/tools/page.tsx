// file: app/tools/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Database, Globe, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools",
  description: "Regex Generator, SQL Builder, API Mock, Boilerplate Generator.",
};

const tools = [
  {
    icon: <Code2 className="h-8 w-8 text-indigo-400" />,
    title: "Regex Generator",
    desc: "Vizual pattern builder, match highlighting, JS/Python/PHP export.",
    href: "/tools/regex",
    gradient: "from-indigo-500 to-blue-500",
    badge: "Hazır",
  },
  {
    icon: <Database className="h-8 w-8 text-purple-400" />,
    title: "SQL Generator",
    desc: "Vizual cədvəl dizayneri, SQL kodu generasiyası, brauzerdə test.",
    href: "/tools/sql",
    gradient: "from-purple-500 to-violet-500",
    badge: "Hazır",
  },
  {
    icon: <Globe className="h-8 w-8 text-pink-400" />,
    title: "API Mock Builder",
    desc: "REST endpoint dizayneri, JSON body, curl/fetch/OpenAPI export.",
    href: "/tools/api-mock",
    gradient: "from-pink-500 to-rose-500",
    badge: "Hazır",
  },
  {
    icon: <Package className="h-8 w-8 text-emerald-400" />,
    title: "Boilerplate Generator",
    desc: "React, Next.js, Node, FastAPI, Django layihə şablonları. ZIP yüklə.",
    href: "/tools/boilerplate",
    gradient: "from-emerald-500 to-teal-500",
    badge: "Hazır",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Developer Tools
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Regex, SQL, API Mock, Boilerplate generatorlarla işinizi sürətləndirin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl border border-border bg-card p-6 space-y-4 transition hover:scale-[1.02] hover:shadow-glow hover:border-primary/50"
          >
            <div className={`inline-flex rounded-xl bg-gradient-to-br ${t.gradient} p-2.5 opacity-90`}>
              {t.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">{t.badge}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ✅ Verified: Dashboard with 4 tool cards, gradient icons, hover effects
