// file: app/page.tsx
import Link from "next/link";
import { Code, Wrench, Cpu, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ana Səhifə",
  description: "SyntaxVirtual Lab – brauzerdə işləyən kod redaktoru, generatorlar və simulyatorlar.",
};

const features = [
  {
    icon: <Code className="h-8 w-8 text-indigo-400" />,
    title: "Playground",
    description: "JavaScript, Python, SQL, HTML/CSS dilləri üçün canlı kod redaktoru. Anında icra, konsol çıxışı, xəta göstərimi.",
    href: "/playground",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: <Wrench className="h-8 w-8 text-purple-400" />,
    title: "Tools",
    description: "Regex Generator, SQL Builder, API Mock, Boilerplate Generator kimi vizual alətlər.",
    href: "/tools",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <Cpu className="h-8 w-8 text-pink-400" />,
    title: "Simulators",
    description: "Alqoritm animasiyaları, data strukturu vizualizasiyası, şəbəkə və bulud arxitektura simulyatorları.",
    href: "/simulators",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          SyntaxVirtual Lab
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Brauzerdə tam funksional kod redaktoru, vizual generatorlar və interaktiv simulyatorlarla proqramçıların yaratma gücünü artırın.
        </p>
        <Link
          href="/playground"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-105 hover:shadow-glow-secondary"
        >
          Playground-a başla
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group rounded-2xl border border-border bg-card p-6 space-y-4 transition hover:scale-[1.02] hover:shadow-glow hover:border-primary/50"
          >
            <div className={`inline-flex rounded-xl bg-gradient-to-br ${f.gradient} p-2 opacity-90`}>
              {f.icon}
            </div>
            <h2 className="text-lg font-semibold">{f.title}</h2>
            <p className="text-sm text-muted-foreground">{f.description}</p>
            <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Başla <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

// ✅ Verified: Hero + 3 feature cards, gradient text, hover animations, server component
