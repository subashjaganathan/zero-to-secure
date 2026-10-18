/**
 * Generates the Zero to Secure favicon and social banner as PNGs from inline SVG,
 * so the build carries no branding from the original project.
 * Run: node scripts/generate-brand.mjs
 */
import sharp from 'sharp';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');

const shield = (size) => `
  <g transform="translate(${size / 2}, ${size / 2}) scale(${size / 512})">
    <path transform="translate(-256,-256)"
      fill="#0f62fe"
      d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"/>
  </g>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f1217"/>
  ${shield(360)}
</svg>`;

const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f1217"/>
  <g transform="translate(210,315)">${shield(300).replace(`translate(${300 / 2}, ${300 / 2})`, 'translate(0,0)')}</g>
  <text x="420" y="285" font-family="Segoe UI, Arial, sans-serif" font-size="92" font-weight="700" fill="#ffffff">Zero to Secure</text>
  <text x="424" y="350" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="400" fill="#a2a9b6">Personal Security &amp; Privacy Checklist</text>
</svg>`;

await sharp(Buffer.from(faviconSvg)).png().toFile(join(publicDir, 'favicon.png'));
await sharp(Buffer.from(bannerSvg)).png().toFile(join(publicDir, 'banner.png'));
console.log('[generate-brand] Wrote favicon.png and banner.png');
