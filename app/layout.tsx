// file: app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: "SyntaxVirtual Lab", template: "%s | SyntaxVirtual Lab" },
  description: "Brauzerdə tam-funksional interaktiv kod laboratoriyası.",
  metadataBase: new URL("https://lab.syntaxvirtual.com"),
  openGraph: {
    title: "SyntaxVirtual Lab",
    description: "Brauzerdə tam-funksional interaktiv kod laboratoriyası.",
    url: "https://lab.syntaxvirtual.com",
    siteName: "SyntaxVirtual Lab",
    locale: "az_AZ",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="sv-theme">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "bg-card border-border",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

// ✅ Verified: ThemeProvider with dark default, Sonner toaster, Inter + JetBrains Mono fonts, SEO metadata
