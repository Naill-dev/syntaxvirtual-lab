// file: lib/runners/html.ts
/**
 * HTML runner – srcDoc + sandboxed iframe ilə canlı preview.
 * HTML/CSS/JS kodunu birləşdirib `<iframe>` içərisində render edir.
 * Təhlükəsizlik: allow-scripts, allow-modals — allow-same-origin YOX.
 */

export interface HtmlRunnerOptions {
  html: string;
  css?: string;
  js?: string;
}

/**
 * Returns a full HTML document string for iframe srcDoc rendering.
 * Injects CSS into <style> and JS into <script> tags.
 */
export function buildHtmlDocument({ html, css = "", js = "" }: HtmlRunnerOptions): string {
  return `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    window.addEventListener('error', (e) => {
      const el = document.createElement('pre');
      el.style.cssText = 'color:red;padding:8px;border:1px solid red;margin:8px;border-radius:4px;font-size:12px';
      el.textContent = '⚠ ' + e.message;
      document.body.prepend(el);
    });
    ${js}
  <\/script>
</body>
</html>`;
}

// ✅ Verified: full HTML document with CSS + JS injection, error display in iframe
