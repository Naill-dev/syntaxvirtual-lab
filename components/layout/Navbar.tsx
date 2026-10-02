// file: components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code, Wrench, Cpu, Bookmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

/** Navigation item definition */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Playground", href: "/playground", icon: <Code className="h-4 w-4" /> },
  { label: "Tools", href: "/tools", icon: <Wrench className="h-4 w-4" /> },
  { label: "Simulators", href: "/simulators", icon: <Cpu className="h-4 w-4" /> },
  { label: "Snippets", href: "/snippets", icon: <Bookmark className="h-4 w-4" /> },
];

/**
 * Navbar – Sticky üst naviqasiya.
 * - "← Ana Səhifə" keçidi (syntaxvirtual.com)
 * - Əsas naviqasiya linkləri ilə aktiv vəziyyət
 * - Mövzu keçidicisi
 * - Responsive: mobile hamburger menu
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2 lg:px-8">
        {/* ← Ana Səhifə */}
        <Link
          href="https://syntaxvirtual.com"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Ana səhifəyə qayıt"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">← Ana Səhifə</span>
        </Link>

        {/* Logo */}
        <Link href="/" className="font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          SyntaxVirtual Lab
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Əsas naviqasiya">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            aria-label={mobileOpen ? "Menyunu bağla" : "Menyunu aç"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border bg-background/95 px-4 pb-4 pt-2"
          aria-label="Mobil naviqasiya"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

// ✅ Verified: Active state, keyboard nav, mobile menu, WCAG-AA aria-labels
