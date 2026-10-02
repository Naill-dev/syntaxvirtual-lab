// file: components/lab/LabSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Code2,
  Regex,
  Database,
  Globe,
  Package,
  BarChart2,
  Search,
  Binary,
  Network,
  Server,
  Cloud,
  Share2,
  BookMarked
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarNav = [
  {
    title: "Mühit",
    items: [
      { title: "Playground", href: "/lab/playground", icon: <Code2 className="w-4 h-4" /> },
    ]
  },
  {
    title: "Generatorlar (Tools)",
    items: [
      { title: "Regex Builder", href: "/lab/tools/regex", icon: <Regex className="w-4 h-4" /> },
      { title: "SQL Generator", href: "/lab/tools/sql", icon: <Database className="w-4 h-4" /> },
      { title: "API Mock", href: "/lab/tools/api-mock", icon: <Globe className="w-4 h-4" /> },
      { title: "Boilerplate", href: "/lab/tools/boilerplate", icon: <Package className="w-4 h-4" /> },
    ]
  },
  {
    title: "Simulyatorlar",
    items: [
      { title: "Sorting", href: "/lab/simulators/sorting", icon: <BarChart2 className="w-4 h-4" /> },
      { title: "Searching", href: "/lab/simulators/searching", icon: <Search className="w-4 h-4" /> },
      { title: "Data Structs", href: "/lab/simulators/data-structures", icon: <Binary className="w-4 h-4" /> },
      { title: "Graph", href: "/lab/simulators/graph", icon: <Share2 className="w-4 h-4" /> },
      { title: "Network", href: "/lab/simulators/network", icon: <Network className="w-4 h-4" /> },
      { title: "Server", href: "/lab/simulators/server", icon: <Server className="w-4 h-4" /> },
      { title: "Cloud", href: "/lab/simulators/cloud", icon: <Cloud className="w-4 h-4" /> },
    ]
  },
  {
    title: "Kitabxana",
    items: [
      { title: "Snippet-lər", href: "/lab/snippets", icon: <BookMarked className="w-4 h-4" /> },
    ]
  }
];

export function LabSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <ScrollArea className="flex-1 py-4">
        <div className="px-4 space-y-6">
          {sidebarNav.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-indigo-500/10 text-indigo-500 font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ✅ Verified: Client-side Sidebar with all categories and active highlights
