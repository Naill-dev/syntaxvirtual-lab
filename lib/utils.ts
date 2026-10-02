// file: lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn – Tailwind class birləşdirici utility.
 * clsx + tailwind-merge kombinasiyası ilə konfliktləri həll edir.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
