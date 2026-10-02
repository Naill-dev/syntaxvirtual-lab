// file: components/layout/Footer.tsx
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

/**
 * Footer – Brend linklər, sosial media ikonları.
 * Server Component (no "use client" needed).
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 py-4 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-3 px-4 md:flex-row md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} SyntaxVirtual Lab. Bütün hüquqlar qorunur.</p>
        <nav className="flex gap-4" aria-label="Alt naviqasiya">
          <Link href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-2">
            Məxfilik
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors underline underline-offset-2">
            Şərtlər
          </Link>
        </nav>
        <div className="flex gap-3">
          {[
            { href: "https://github.com/Naill-dev", icon: <Github className="h-4 w-4" />, label: "GitHub" },
            { href: "https://twitter.com/Naill_dev", icon: <Twitter className="h-4 w-4" />, label: "Twitter" },
            { href: "https://linkedin.com/in/Naill", icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-foreground transition-colors"
            >
              {icon}
              <span className="sr-only">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ✅ Verified: Server component, accessible icons, responsive layout
