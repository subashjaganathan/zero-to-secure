/**
 * Prefix an internal, root-absolute path with the app's base URL so links work
 * when the site is served from a sub-path (e.g. a GitHub Pages project site).
 *
 * `import.meta.env.BASE_URL` is provided by Vite and equals the `base` config
 * value ("/zero-to-secure/" in production, "/" in dev).
 */
export const withBase = (path: string): string => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};
