// file: app/playground/page.tsx
import type { Metadata } from "next";
import { Playground } from "@/components/playground/Playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "JavaScript, Python, SQL, HTML dilləri üçün canlı kod redaktoru.",
};

/**
 * Playground page – bütün ekranı dolduran edit mühiti.
 * Navbar-da "Playground" linki bura gəlir.
 */
export default function PlaygroundPage() {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 57px)" }}
    >
      <Playground />
    </div>
  );
}

// ✅ Verified: Full-height layout, Playground component mounted
