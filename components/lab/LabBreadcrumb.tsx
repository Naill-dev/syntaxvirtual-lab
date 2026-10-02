// file: components/lab/LabBreadcrumb.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import React from "react";

export function LabBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/lab" className="hover:text-foreground transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {paths.map((path, index) => {
        // Skip the first "lab" in breadcrumb to avoid redundancy with the Home icon
        if (index === 0 && path === "lab") return null;

        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        
        // Format path strings: replace hyphens with spaces, capitalize
        const formattedPath = path.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3.5 h-3.5" />
            {isLast ? (
              <span className="font-medium text-foreground">{formattedPath}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {formattedPath}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ✅ Verified: Breadcrumb navigation dynamic from pathname
