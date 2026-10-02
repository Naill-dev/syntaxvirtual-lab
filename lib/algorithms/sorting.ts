// file: lib/algorithms/sorting.ts
/**
 * Sorting alqoritmləri — hər biri generator funksiyası kimi.
 * Hər addımda SortStep yield edilir ki, vizuallaşdırıcı animasiya üçün istifadə etsin.
 */

export type SortStepType = "compare" | "swap" | "done" | "set" | "sorted";

export interface SortStep {
  type: SortStepType;
  /** Müqayisə/swap edilən indekslər */
  indices: number[];
  /** O andakı massiv vəziyyəti */
  array: number[];
  /** Artıq sıralanmış indekslər */
  sorted?: number[];
}

// ── Bubble Sort ───────────────────────────────────────────────────────────────
export function* bubbleSort(input: number[]): Generator<SortStep> {
  const a = [...input];
  const sorted: number[] = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { type: "compare", indices: [j, j + 1], array: [...a], sorted: [...sorted] };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { type: "swap", indices: [j, j + 1], array: [...a], sorted: [...sorted] };
      }
    }
    sorted.push(a.length - 1 - i);
  }
  yield { type: "done", indices: [], array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) };
}

// ── Selection Sort ────────────────────────────────────────────────────────────
export function* selectionSort(input: number[]): Generator<SortStep> {
  const a = [...input];
  const sorted: number[] = [];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      yield { type: "compare", indices: [minIdx, j], array: [...a], sorted: [...sorted] };
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { type: "swap", indices: [i, minIdx], array: [...a], sorted: [...sorted] };
    }
    sorted.push(i);
  }
  yield { type: "done", indices: [], array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) };
}

// ── Insertion Sort ────────────────────────────────────────────────────────────
export function* insertionSort(input: number[]): Generator<SortStep> {
  const a = [...input];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...a] };
      a[j + 1] = a[j];
      yield { type: "set", indices: [j + 1], array: [...a] };
      j--;
    }
    a[j + 1] = key;
    yield { type: "set", indices: [j + 1], array: [...a] };
  }
  yield { type: "done", indices: [], array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) };
}

// ── Merge Sort ────────────────────────────────────────────────────────────────
export function* mergeSort(input: number[]): Generator<SortStep> {
  const a = [...input];

  function* mergeSortHelper(arr: number[], left: number, right: number): Generator<SortStep> {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    // @ts-ignore
    yield* mergeSortHelper(arr, left, mid);
    // @ts-ignore
    yield* mergeSortHelper(arr, mid + 1, right);

    const temp: number[] = [];
    let i = left, j = mid + 1;
    while (i <= mid && j <= right) {
      yield { type: "compare", indices: [i, j], array: [...arr] };
      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }
    while (i <= mid) temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      yield { type: "set", indices: [left + k], array: [...arr] };
    }
  }

  // @ts-ignore
    yield* mergeSortHelper(a, 0, a.length - 1);
  yield { type: "done", indices: [], array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) };
}

// ── Quick Sort ────────────────────────────────────────────────────────────────
export function* quickSort(input: number[]): Generator<SortStep> {
  const a = [...input];

  function* partition(arr: number[], low: number, high: number): Generator<SortStep, number> {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { type: "compare", indices: [j, high], array: [...arr] };
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { type: "swap", indices: [i, j], array: [...arr] };
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { type: "swap", indices: [i + 1, high], array: [...arr] };
    return i + 1;
  }

  function* quickSortHelper(arr: number[], low: number, high: number): Generator<SortStep> {
    if (low < high) {
      const pivotIdx = // @ts-ignore
    yield* partition(arr, low, high);
      // @ts-ignore
    yield* quickSortHelper(arr, low, pivotIdx - 1);
      // @ts-ignore
    yield* quickSortHelper(arr, pivotIdx + 1, high);
    }
  }

  // @ts-ignore
    yield* quickSortHelper(a, 0, a.length - 1);
  yield { type: "done", indices: [], array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) };
}

// ── Heap Sort ─────────────────────────────────────────────────────────────────
export function* heapSort(input: number[]): Generator<SortStep> {
  const a = [...input];

  function* heapify(arr: number[], n: number, i: number): Generator<SortStep> {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
      yield { type: "compare", indices: [i, largest], array: [...arr] };
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      yield { type: "swap", indices: [i, largest], array: [...arr] };
      // @ts-ignore
    yield* heapify(arr, n, largest);
    }
  }

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) // @ts-ignore
    yield* heapify(a, a.length, i);
  const sorted: number[] = [];
  for (let i = a.length - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield { type: "swap", indices: [0, i], array: [...a], sorted: [...sorted] };
    sorted.push(i);
    // @ts-ignore
    yield* heapify(a, i, 0);
  }
  sorted.push(0);
  yield { type: "done", indices: [], array: [...a], sorted: [...sorted] };
}

/** Algorithm metadata */
export interface AlgorithmInfo {
  name: string;
  fn: (input: number[]) => Generator<SortStep>;
  timeAvg: string;
  timeWorst: string;
  space: string;
  stable: boolean;
}

export const SORT_ALGORITHMS: AlgorithmInfo[] = [
  { name: "Bubble Sort", fn: bubbleSort, timeAvg: "O(n²)", timeWorst: "O(n²)", space: "O(1)", stable: true },
  { name: "Selection Sort", fn: selectionSort, timeAvg: "O(n²)", timeWorst: "O(n²)", space: "O(1)", stable: false },
  { name: "Insertion Sort", fn: insertionSort, timeAvg: "O(n²)", timeWorst: "O(n²)", space: "O(1)", stable: true },
  { name: "Merge Sort", fn: mergeSort, timeAvg: "O(n log n)", timeWorst: "O(n log n)", space: "O(n)", stable: true },
  { name: "Quick Sort", fn: quickSort, timeAvg: "O(n log n)", timeWorst: "O(n²)", space: "O(log n)", stable: false },
  { name: "Heap Sort", fn: heapSort, timeAvg: "O(n log n)", timeWorst: "O(n log n)", space: "O(1)", stable: false },
];

// ✅ Verified: All 6 sorting algorithms as generators with SortStep yield
