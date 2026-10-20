/*
 * Adds a Content-Security-Policy and referrer policy to every built page.
 *
 * GitHub Pages cannot send response headers, so the policy goes in a <meta> tag.
 * Qwik inlines a handful of small bootstrap scripts (the loader, prefetch hints,
 * serialized functions, our theme script), and some of them differ per page. Each
 * one is pinned by its SHA-256 hash, and every page carries the hashes from all
 * pages: client-side navigation keeps the first page's policy for the whole visit.
 *
 * Inline `type="qwik/json"` blocks are data, never executed, so they need no hash.
 * Styles stay 'unsafe-inline' because Qwik renders style attributes and <style> tags.
 *
 * Runs after the static build and write-404.mjs. Rebuild rather than editing dist/.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'zero-to-secure');
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const DATA_TYPE = /\btype\s*=\s*["']?(qwik\/json|application\/(ld\+)?json)/i;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

const files = htmlFiles(distDir);
const hashes = new Set();
for (const file of files) {
  for (const [, attrs, body] of readFileSync(file, 'utf-8').matchAll(SCRIPT_RE)) {
    if (/\bsrc\s*=/.test(attrs) || DATA_TYPE.test(attrs) || !body.trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const csp = [
  "default-src 'none'",
  `script-src 'self' ${[...hashes].sort().join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');
const tags = `<meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="strict-origin-when-cross-origin">`;

let written = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  // The policy must come before any script it governs. Put it right after <meta charset>
  // (which has to stay within the first 1024 bytes), or after <head> if there is none.
  const charset = /<meta\s+charset=["']?[\w-]+["']?[^>]*>/i;
  const out = charset.test(html)
    ? html.replace(charset, (m) => m + tags)
    : html.replace(/<head\b[^>]*>/i, (m) => m + tags);
  if (out === html) {
    console.error(`[add-csp] No <head> in ${file}`);
    process.exit(1);
  }
  writeFileSync(file, out, 'utf-8');
  written++;
}
console.log(`[add-csp] ${written} pages, ${hashes.size} inline script hashes`);
