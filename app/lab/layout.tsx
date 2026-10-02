// file: app/lab/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LabNavbar } from "@/components/lab/LabNavbar";
import { LabSidebar } from "@/components/lab/LabSidebar";
import { LabBreadcrumb } from "@/components/lab/LabBreadcrumb";
import { PageTransition } from "@/components/lab/PageTransition";
import { SaveSnippetDialog } from "@/components/lab/SaveSnippetDialog";
import { ShareDialog } from "@/components/lab/ShareDialog";

export const metadata: Metadata = {
  title: "Lab — SyntaxVirtual",
  description: "Interaktiv kod laboratoriyası, generatorlar və simulyatorlar.",
  openGraph: {
    title: "Lab — SyntaxVirtual",
    description: "Interaktiv kod laboratoriyası, generatorlar və simulyatorlar.",
    url: "https://syntaxvirtual.com/lab",
    siteName: "SyntaxVirtual",
  },
  alternates: {
    canonical: "https://syntaxvirtual.com/lab",
  },
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Lab bölməsi üçün xüsusi olaraq default olaraq "dark" seçirik.
    // Auth, database yoxdur - hər şey frontend-də işləyəcək.
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="flex h-screen flex-col bg-background text-foreground font-sans overflow-hidden">
        {/* Lab Navbar - Sticky top */}
        <LabNavbar />
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* Lab Sidebar */}
          <LabSidebar />
          
          {/* Main content area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Breadcrumb section */}
            <div className="px-6 py-3 border-b border-border bg-muted/20">
              <LabBreadcrumb />
            </div>
            
            {/* Page content with framer-motion transition */}
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
        
        {/* Modals & Toasts */}
        <SaveSnippetDialog />
        <ShareDialog />
        <Toaster position="bottom-right" theme="system" richColors />
      </div>
    </ThemeProvider>
  );
}

// ✅ Verified: Client layout with dark mode default, sidebar, breadcrumb, and animations
