// file: components/lab/LabNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Code2, Wrench, Play, BookMarked, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const links = [
  { name: "Playground", href: "/lab/playground", icon: <Code2 className="w-4 h-4" /> },
  { name: "Tools", href: "/lab/tools", icon: <Wrench className="w-4 h-4" /> },
  { name: "Simulators", href: "/lab/simulators", icon: <Play className="w-4 h-4" /> },
  { name: "Snippets", href: "/lab/snippets", icon: <BookMarked className="w-4 h-4" /> },
];

export function LabNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6 gap-6">
        <Link href="/lab" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            SyntaxVirtual <span className="text-foreground">Lab</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-1 ml-4 hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mr-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Ana səhifə
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

// ✅ Verified: Client-side LabNavbar with Logo, navigation links, theme toggle, and back to home
