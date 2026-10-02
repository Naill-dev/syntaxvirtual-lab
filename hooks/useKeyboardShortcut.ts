// file: hooks/useKeyboardShortcut.ts
import { useEffect } from 'react';

/**
 * Global klaviatura qısayolları (shortcuts) üçün hook.
 * Məsələn: Ctrl+Enter üçün useKeyboardShortcut('Enter', true, () => run())
 */
export function useKeyboardShortcut(
  key: string,
  ctrlOrCmd: boolean,
  callback: () => void,
  shift: boolean = false
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (ctrlOrCmd ? (event.ctrlKey || event.metaKey) : true) &&
        (shift ? event.shiftKey : !event.shiftKey)
      ) {
        event.preventDefault();
        callback();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, ctrlOrCmd, callback, shift]);
}

// ✅ Verified: Global keyboard shortcut handler, supports macOS Meta key and Shift
