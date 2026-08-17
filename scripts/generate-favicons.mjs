import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const SCRIPTS = join(ROOT, "scripts");
const LOGO = join(ROOT, "src", "assets", "images", "logos", "logo_asociacion.webp");

const BRAND = { r: 188, g: 90, b: 69 }; // brand-500 #bc5a45

function brandBrown(input) {
  return sharp(input).tint(BRAND);
}

if (!existsSync(LOGO)) {
  console.error("Logo not found:", LOGO);
  process.exit(1);
}

const logo = readFileSync(LOGO);

const sizes = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-48x48.png", 48],
  ["apple-touch-icon.png", 180],
  ["favicon-192.png", 192],
  ["favicon-512.png", 512],
];

for (const [name, size] of sizes) {
  const data = await brandBrown(logo).resize(size, size).png().toBuffer();
  writeFileSync(join(PUBLIC, name), data);
  console.log(`ok ${name} (${size}x${size}, ${Math.round(data.length / 1024)} KB)`);
}

const png512 = await brandBrown(logo).resize(512, 512).png().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${png512.toString("base64")}"/></svg>`;
writeFileSync(join(PUBLIC, "favicon.svg"), svg);
console.log("ok favicon.svg (base64 embed)");

const ogSvg = readFileSync(join(SCRIPTS, "og-template.svg"));
const ogBg = await sharp(ogSvg).resize(1200, 630).png().toBuffer();
const icon = await brandBrown(logo).resize(340, 340).png().toBuffer();
const og = await sharp(ogBg)
  .composite([{ input: icon, left: 430, top: 60 }])
  .png()
  .toBuffer();
writeFileSync(join(PUBLIC, "og-image.png"), og);
console.log(`ok og-image.png (1200x630, ${Math.round(og.length / 1024)} KB)`);

console.log("Favicons and OG image generated");