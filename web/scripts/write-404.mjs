/*
 * The Qwik static adapter emits a generic, unstyled 404.html, and GitHub Pages
 * serves that file for any unknown path under the project site. The branded
 * src/routes/_404.tsx is never reached, so this writes a matching standalone
 * page over the top of it after the static build.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = '/zero-to-secure/';
const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'zero-to-secure');

const html = `<!DOCTYPE html>
<html lang="en-us">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Status" content="404">
  <title>Page not found · Zero to Secure</title>
  <link rel="icon" type="image/png" href="${BASE}favicon.png">
  <style>
    @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400 700; font-display: swap; src: url('${BASE}fonts/inter-latin-var.woff2') format('woff2'); }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;
      background: #f6f7f9; color: #161b26; -webkit-font-smoothing: antialiased;
      font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    main { width: min(520px, 100%); background: #fff; border: 1px solid #e3e6eb; border-radius: 16px; padding: 40px; }
    .code { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #0f62fe; }
    h1 { margin: 8px 0 0; font-size: 32px; letter-spacing: -.025em; }
    p { margin: 12px 0 0; line-height: 1.6; color: #5d6779; }
    a { display: inline-block; margin-top: 28px; padding: 11px 18px; border-radius: 8px; background: #0f62fe; color: #fff; font-weight: 600; text-decoration: none; }
    a:hover { background: #0043ce; }
  </style>
</head>
<body>
  <main>
    <p class="code">Error 404</p>
    <h1>Page not found</h1>
    <p>That checklist doesn't exist. It may have been renamed or moved.</p>
    <a href="${BASE}">Back to Zero to Secure</a>
  </main>
</body>
</html>
`;

if (!existsSync(distDir)) {
  console.error(`[write-404] ${distDir} does not exist. Run the static build first.`);
  process.exit(1);
}

writeFileSync(join(distDir, '404.html'), html, 'utf-8');
console.log('[write-404] Wrote branded 404.html');
