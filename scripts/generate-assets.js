import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const brandDir = path.resolve('public/assets/brand');

fs.mkdirSync(brandDir, { recursive: true });

// SVG for the Symbol Icon (Helmet in circle with green checkmark)
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="navyRing" x1="60" y1="60" x2="452" y2="452" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00467F" />
      <stop offset="45%" stop-color="#071B2F" />
      <stop offset="100%" stop-color="#041220" />
    </linearGradient>
    <linearGradient id="helmetGrad" x1="120" y1="40" x2="392" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0066B3" />
      <stop offset="50%" stop-color="#06213B" />
      <stop offset="100%" stop-color="#041220" />
    </linearGradient>
    <linearGradient id="greenCheck" x1="160" y1="360" x2="440" y2="240" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#59E600" />
      <stop offset="50%" stop-color="#45C900" />
      <stop offset="100%" stop-color="#35B800" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#071B2F" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Outer Circle Ring -->
  <circle cx="256" cy="256" r="236" stroke="white" stroke-width="20" fill="none" />
  <circle cx="256" cy="256" r="226" stroke="url(#navyRing)" stroke-width="36" fill="#06213B" fill-opacity="0.05" />

  <!-- Helmet Dome -->
  <g filter="url(#dropShadow)">
    <path d="M120 220 C120 110, 200 60, 256 60 C312 60, 392 110, 392 220 Z" fill="url(#helmetGrad)" stroke="white" stroke-width="12" />
    <!-- Helmet Central Ridge -->
    <path d="M236 62 C236 62, 246 54, 256 54 C266 54, 276 62, 276 62 L284 210 L228 210 Z" fill="#005B9E" stroke="white" stroke-width="8" />
    <!-- Helmet Brim / Visor -->
    <path d="M96 220 C96 208, 416 208, 416 220 C416 238, 380 252, 256 252 C132 252, 96 238, 96 220 Z" fill="#071B2F" stroke="white" stroke-width="12" />
    <!-- Lower Head Shell arc -->
    <path d="M150 248 C180 290, 332 290, 362 248 C340 330, 172 330, 150 248 Z" fill="#041220" />
  </g>

  <!-- Large Vibrant Green Checkmark (Hero Element) -->
  <g filter="url(#dropShadow)">
    <path d="M180 340 L236 396 C242 402, 252 402, 258 396 L440 246 C452 236, 444 216, 428 222 L248 344 L196 296 C184 286, 168 300, 180 340 Z"
      fill="url(#greenCheck)" stroke="white" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" />
    <!-- Glossy Highlight on Checkmark -->
    <path d="M188 332 L236 380 L420 236" stroke="#9EFF38" stroke-width="6" stroke-linecap="round" opacity="0.8" />
  </g>
</svg>
`;

// Maskable Icon SVG with 15% safe padding
const maskableIconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#06213B" />
  <g transform="translate(64, 64) scale(0.75)">
    ${iconSvg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
  </g>
</svg>
`;

// Horizontal Logo SVG
const logoHorizontalSvg = `
<svg width="1200" height="360" viewBox="0 0 1200 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hGreenCheck" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#59E600" />
      <stop offset="50%" stop-color="#45C900" />
      <stop offset="100%" stop-color="#35B800" />
    </linearGradient>
    <linearGradient id="hNavy" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0F2D4E" />
      <stop offset="100%" stop-color="#041220" />
    </linearGradient>
  </defs>

  <!-- Green Cursive "eu" -->
  <g transform="translate(40, 70)">
    <!-- Stylized 'e' and 'u' with custom path flow and white outline -->
    <text x="20" y="160" font-family="'Plus Jakarta Sans', 'Nunito', 'Segoe UI', cursive, sans-serif" font-weight="900" font-style="italic" font-size="210" fill="url(#hGreenCheck)" stroke="white" stroke-width="20" paint-order="stroke fill">eu</text>
    <path d="M 30 210 Q 150 250 280 200" stroke="url(#hGreenCheck)" stroke-width="24" stroke-linecap="round" fill="none" />
  </g>

  <!-- Bold Navy "RESOLVO" -->
  <g transform="translate(320, 60)">
    <text x="0" y="170" font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', sans-serif" font-weight="900" font-size="180" letter-spacing="-2" fill="url(#hNavy)" stroke="white" stroke-width="16" paint-order="stroke fill">RESOLVO</text>
  </g>

  <!-- Circular Helmet Symbol on the Right -->
  <g transform="translate(940, 20) scale(0.62)">
    ${iconSvg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
  </g>
</svg>
`;

async function run() {
  console.log('Generating PNG assets with sharp...');
  
  // Icon sizes
  const iconBuffer = Buffer.from(iconSvg);
  await sharp(iconBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(iconBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(iconBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(iconBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(iconBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));

  // Also save in brand dir
  await sharp(iconBuffer).resize(512, 512).png().toFile(path.join(brandDir, 'icon-symbol.png'));
  
  // Maskable
  const maskableBuffer = Buffer.from(maskableIconSvg);
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Horizontal Logo
  const logoBuffer = Buffer.from(logoHorizontalSvg);
  await sharp(logoBuffer).resize(1200, 360).png().toFile(path.join(brandDir, 'logo-horizontal.png'));
  await sharp(logoBuffer).resize(800, 240).png().toFile(path.join(publicDir, 'logo-horizontal.png'));

  // Save SVGs as well for sharp vector rendering
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(brandDir, 'icon-symbol.svg'), iconSvg);
  fs.writeFileSync(path.join(brandDir, 'logo-horizontal.svg'), logoHorizontalSvg);

  console.log('Successfully generated all brand and PWA assets!');
}

run().catch(console.error);
