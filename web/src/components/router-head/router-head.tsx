import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";
import { withBase } from "~/utils/base";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      {/* Self-hosted fonts. Declared here rather than in global.css so the
          URLs can be resolved against the app's base path. */}
      <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={withBase("/fonts/inter-latin-var.woff2")} />
      <style dangerouslySetInnerHTML={`
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400 700; font-display: swap; src: url('${withBase("/fonts/inter-latin-var.woff2")}') format('woff2'); }
      `} />

      {/* Basics */}
      <title>{head.title || 'Zero to Secure · Practical Digital Security'}</title>
      <meta name="description" content="Practical digital security, one step at a time. A free, open checklist covering authentication, browsing, devices, networks, AI and more." />

      {/* Site config */}
      <meta name="author" content="Subash Jaganathan" />
      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href={withBase("/logo.svg")} />
      <link rel="icon" type="image/png" href={withBase("/favicon.png")} />
      <link rel="apple-touch-icon" href={withBase("/favicon.png")} />
      <meta name="theme-color" content="#0f62fe" />
      <link rel="manifest" href={withBase("/manifest.json")} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={loc.url.href} />
      <meta property="og:title" content="Zero to Secure · Practical Digital Security" />
      <meta property="og:description" content="Practical digital security, one step at a time. A free, open checklist covering authentication, browsing, devices, networks, AI and more." />
      <meta property="og:image" content={withBase("/banner.png")} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={loc.url.href} />
      <meta property="twitter:title" content="Zero to Secure · Practical Digital Security" />
      <meta name="twitter:description" content="Practical digital security, one step at a time. A free, open checklist covering authentication, browsing, devices, networks, AI and more." />
      <meta name="twitter:image" content={withBase("/banner.png")} />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}

      {head.scripts.map((s) => (
        <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
      ))}
    </>
  );
});
