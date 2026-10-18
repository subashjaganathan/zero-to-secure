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
    :root { color-scheme: dark light; }
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0f172a; color: #e2e8f0; text-align: center; padding: 2rem;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }
    .code { font-size: 4rem; font-weight: 800; margin: 0;
      background: linear-gradient(90deg, #8b5cf6, #ec4899, #22d3ee);
      -webkit-background-clip: text; background-clip: text; color: transparent; }
    h1 { font-size: 1.5rem; margin: 0.5rem 0 0.25rem; }
    p { color: #94a3b8; margin: 0 0 1.75rem; }
    a { display: inline-block; padding: 0.7rem 1.4rem; border-radius: 0.5rem;
        background: #8b5cf6; color: #fff; font-weight: 600; text-decoration: none; }
    a:hover { background: #7c3aed; }
    @media (prefers-color-scheme: light) {
      body { background: #f8fafc; color: #0f172a; }
      p { color: #475569; }
    }
  </style>
</head>
<body>
  <main>
    <p class="code">404</p>
    <h1>Page not found</h1>
    <p>That checklist doesn't exist. It may have been renamed or moved.</p>
    <a href="${BASE}">Back to the checklists</a>
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
