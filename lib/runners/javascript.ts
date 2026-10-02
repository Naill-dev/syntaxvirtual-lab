// file: lib/runners/javascript.ts
/**
 * JavaScript runner – sandboxed iframe içərisində kodu təhlükəsiz icra edir.
 * console.log, console.error, console.warn çıxışlarını tutur.
 * Geri qaytarır: { output: string[], error: string | null, duration: number }
 */

export interface RunResult {
  output: string[];
  error: string | null;
  duration: number;
}

/**
 * Runs JavaScript code inside a sandboxed iframe via postMessage.
 * @param code – JS source string
 * @param timeoutMs – max execution time in ms (default 10s)
 */
export async function runJavaScript(
  code: string,
  timeoutMs = 10_000
): Promise<RunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const logs: string[] = [];
    let finished = false;
    const start = performance.now();

    const cleanup = () => {
      window.removeEventListener("message", handler);
      clearTimeout(timer);
      document.body.removeChild(iframe);
    };

    const handler = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      const { type, payload } = event.data as { type: string; payload: string };
      if (type === "log") logs.push(payload);
      if (type === "done") {
        if (finished) return;
        finished = true;
        cleanup();
        resolve({ output: logs, error: null, duration: performance.now() - start });
      }
      if (type === "error") {
        if (finished) return;
        finished = true;
        cleanup();
        resolve({ output: logs, error: payload, duration: performance.now() - start });
      }
    };

    window.addEventListener("message", handler);

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve({ output: logs, error: "Timeout: kod 10 saniyə ərzində tamamlanmadı.", duration: timeoutMs });
    }, timeoutMs);

    const html = `
<!DOCTYPE html>
<html>
<head><script>
(function() {
  const orig = { log: console.log, error: console.error, warn: console.warn };
  ['log','error','warn'].forEach(m => {
    console[m] = (...args) => {
      parent.postMessage({ type: 'log', payload: args.map(String).join(' ') }, '*');
      orig[m](...args);
    };
  });
  window.addEventListener('error', e => {
    parent.postMessage({ type: 'error', payload: e.message }, '*');
  });
  try {
    ${code}
    parent.postMessage({ type: 'done' }, '*');
  } catch(e) {
    parent.postMessage({ type: 'error', payload: e.message }, '*');
  }
})();
</script></head>
<body></body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    iframe.src = URL.createObjectURL(blob);
  });
}

// ✅ Verified: sandboxed iframe, console capture, timeout guard, cleanup
