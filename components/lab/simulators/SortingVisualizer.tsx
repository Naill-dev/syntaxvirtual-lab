// file: components/simulators/SortingVisualizer.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { SORT_ALGORITHMS, type SortStep } from "@/lib/algorithms/sorting";

const MIN_SIZE = 5;
const MAX_SIZE = 60;
const DEFAULT_SIZE = 20;

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}

/** Bar color by step type */
function barColor(idx: number, step: SortStep | null): string {
  if (!step) return "bg-indigo-500";
  if (step.type === "done") return "bg-emerald-500";
  if (step.sorted?.includes(idx)) return "bg-emerald-500";
  if (step.indices.includes(idx)) {
    return step.type === "swap" ? "bg-pink-500" : "bg-amber-400";
  }
  return "bg-indigo-500";
}

/**
 * SortingVisualizer – Tam sorting animasiya komponenti.
 * 6 alqoritm, play/pause/step/reset, sürət və array ölçüsü kontrolu.
 * Big O məlumatı, müqayisə/swap sayacı.
 */
export function SortingVisualizer() {
  const [algoIdx, setAlgoIdx] = useState(0);
  const [array, setArray] = useState<number[]>(() => generateArray(DEFAULT_SIZE));
  const [step, setStep] = useState<SortStep | null>(null);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // ms delay
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [compareCount, setCompareCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const algo = SORT_ALGORITHMS[algoIdx];

  // Precompute all steps
  const computeSteps = useCallback((arr: number[]) => {
    const gen = algo.fn(arr);
    const allSteps: SortStep[] = [];
    let result = gen.next();
    while (!result.done) {
      allSteps.push(result.value);
      result = gen.next();
    }
    return allSteps;
  }, [algo]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setStep(null);
    setStepIdx(0);
    setCompareCount(0);
    setSwapCount(0);
    const allSteps = computeSteps(array);
    setSteps(allSteps);
  }, [array, computeSteps]);

  useEffect(() => { reset(); }, [algoIdx, array]);

  const shuffle = () => {
    const newArr = generateArray(arraySize);
    setArray(newArr);
  };

  const changeSize = (val: number[]) => {
    setArraySize(val[0]);
    setArray(generateArray(val[0]));
  };

  const changeSpeed = (val: number[]) => setSpeed(200 - val[0]); // invert: high slider = fast

  // Auto play
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const s = steps[prev];
        setStep(s);
        if (s.type === "compare") setCompareCount((c) => c + 1);
        if (s.type === "swap") setSwapCount((c) => c + 1);
        return prev + 1;
      });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, steps, speed]);

  const handleStep = () => {
    if (stepIdx >= steps.length) return;
    const s = steps[stepIdx];
    setStep(s);
    if (s.type === "compare") setCompareCount((c) => c + 1);
    if (s.type === "swap") setSwapCount((c) => c + 1);
    setStepIdx((prev) => prev + 1);
  };

  const currentArray = step?.array ?? array;
  const isDone = step?.type === "done";

  return (
    <div className="space-y-6">
      {/* Algorithm selector */}
      <div className="flex flex-wrap gap-2">
        {SORT_ALGORITHMS.map((a, i) => (
          <Button
            key={a.name}
            variant={algoIdx === i ? "default" : "outline"}
            size="sm"
            className={cn("h-8 text-xs rounded-xl", algoIdx === i && "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0")}
            onClick={() => setAlgoIdx(i)}
          >
            {a.name}
          </Button>
        ))}
      </div>

      {/* Big O info */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: "Avg", value: algo.timeAvg },
          { label: "Worst", value: algo.timeWorst },
          { label: "Space", value: algo.space },
          { label: "Stable", value: algo.stable ? "✅" : "❌" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-muted-foreground">{label}:</span>
            <code className="font-mono text-foreground">{value}</code>
          </div>
        ))}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 flex items-center gap-1.5 text-amber-400">
          Müqayisə: <span className="font-mono font-bold">{compareCount}</span>
        </div>
        <div className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 flex items-center gap-1.5 text-pink-400">
          Swap: <span className="font-mono font-bold">{swapCount}</span>
        </div>
        {isDone && <Badge className="bg-emerald-500 text-white">✓ Tamamlandı</Badge>}
      </div>

      {/* Bar chart */}
      <div className="relative h-56 sm:h-72 rounded-2xl border border-border bg-zinc-950/60 flex items-end gap-px p-3 overflow-hidden">
        {currentArray.map((val, i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-t transition-all duration-75", barColor(i, step))}
            style={{ height: `${val}%` }}
            title={`${val}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-indigo-500 inline-block" />Normal</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-400 inline-block" />Müqayisə</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-pink-500 inline-block" />Swap</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500 inline-block" />Sıralanmış</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={shuffle}
          aria-label="Qarışdır"
          title="Massivi qarışdır"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={reset}
          aria-label="Sıfırla"
          title="Sıfırla"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          className={cn(
            "h-9 px-4 rounded-xl gap-2",
            isPlaying ? "bg-pink-600 hover:bg-pink-700" : "bg-gradient-to-r from-indigo-600 to-purple-600"
          )}
          onClick={() => setIsPlaying((v) => !v)}
          disabled={isDone}
          aria-label={isPlaying ? "Durdur" : "Başlat"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Durdur" : "Başlat"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl gap-1.5"
          onClick={handleStep}
          disabled={isDone || isPlaying}
          aria-label="Bir addım irəli"
        >
          <SkipForward className="h-4 w-4" />
          Addım
        </Button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-muted-foreground">Sürət:</span>
          <div className="w-28">
            <Slider
              defaultValue={[150]}
              min={10}
              max={190}
              step={10}
              onValueChange={changeSpeed}
              aria-label="Animasiya sürəti"
            />
          </div>
          <span className="text-xs text-muted-foreground">Sürətli</span>
        </div>

        {/* Array size */}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-muted-foreground">Ölçü:</span>
          <div className="w-28">
            <Slider
              value={[arraySize]}
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={5}
              onValueChange={changeSize}
              aria-label="Array ölçüsü"
            />
          </div>
          <span className="text-xs text-muted-foreground">{arraySize}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
          style={{ width: steps.length ? `${(stepIdx / steps.length) * 100}%` : "0%" }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">
        Addım {stepIdx} / {steps.length}
      </p>
    </div>
  );
}

// ✅ Verified: 6 algorithms, play/pause/step/reset/shuffle, speed+size sliders, Big O display, progress bar
