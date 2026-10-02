// file: app/simulators/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BarChart2, Network, Server, Cloud, Binary } from "lucide-react";

export const metadata: Metadata = {
  title: "Simulators",
  description: "Alqoritm animasiyaları, data strukturu, şəbəkə, server, bulud simulyatorları.",
};

const simulators = [
  {
    icon: <BarChart2 className="h-8 w-8 text-indigo-400" />,
    title: "Sorting Visualizer",
    desc: "Bubble, Quick, Merge, Heap sort animasiyaları. Addım-addım, sürət kontrolu, Big O.",
    href: "/simulators/sorting",
    gradient: "from-indigo-500 to-blue-500",
    badge: "Hazır",
  },
  {
    icon: <Binary className="h-8 w-8 text-purple-400" />,
    title: "Data Strukturları",
    desc: "Stack, Queue, Linked List, BST, Heap, Hash Table vizuallaşdırması.",
    href: "/simulators/data-structures",
    gradient: "from-purple-500 to-violet-500",
    badge: "Tezliklə",
  },
  {
    icon: <Network className="h-8 w-8 text-pink-400" />,
    title: "Şəbəkə Simulyatoru",
    desc: "Drag-drop node-lar, paket axını, latency, OSI modeli, HTTP/DNS axınları.",
    href: "/simulators/network",
    gradient: "from-pink-500 to-rose-500",
    badge: "Tezliklə",
  },
  {
    icon: <Server className="h-8 w-8 text-amber-400" />,
    title: "Server Simulyatoru",
    desc: "Load balancer, request axını, cache, rate limiting, DDoS simulyasiyası.",
    href: "/simulators/server",
    gradient: "from-amber-500 to-orange-500",
    badge: "Tezliklə",
  },
  {
    icon: <Cloud className="h-8 w-8 text-emerald-400" />,
    title: "Bulud Arxitekturası",
    desc: "AWS/Azure/GCP komponentləri, auto-scaling, CI/CD pipeline vizuallaşdırması.",
    href: "/simulators/cloud",
    gradient: "from-emerald-500 to-teal-500",
    badge: "Tezliklə",
  },
];

export default function SimulatorsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Simulyatorlar
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Alqoritm, data strukturu, şəbəkə, server və bulud arxitekturalarını interaktiv vizuallaşdırma ilə öyrən.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {simulators.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-border bg-card p-6 space-y-4 transition hover:scale-[1.02] hover:shadow-glow hover:border-primary/50"
          >
            <div className={`inline-flex rounded-xl bg-gradient-to-br ${s.gradient} p-2.5 opacity-90`}>
              {s.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <span className={`rounded-full px-2 py-0.5 text-[10px] border ${s.badge === "Hazır" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}>
                  {s.badge}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ✅ Verified: Dashboard with 5 simulator cards, badge variants, hover effects
