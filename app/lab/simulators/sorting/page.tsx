// file: app/simulators/sorting/page.tsx
import type { Metadata } from "next";
import { SortingVisualizer } from "@/components/lab/simulators/SortingVisualizer";

export const metadata: Metadata = {
  title: "Sorting Visualizer",
  description: "Bubble, Selection, Insertion, Merge, Quick, Heap sort animasiyaları.",
};

export default function SortingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Sorting Visualizer</h1>
        <p className="text-sm text-muted-foreground">
          6 sıralama alqoritmini interaktiv animasiya ilə öyrən. Addım-addım, sürət kontrolu, Big O göstərici.
        </p>
      </div>
      <SortingVisualizer />
    </div>
  );
}
