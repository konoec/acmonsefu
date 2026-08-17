import sharp from "sharp";
import { readdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function rmWithRetry(path, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      rmSync(path, { force: true });
      return;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(100 * (i + 1));
    }
  }
}

const TARGETS = [
  { dir: "src/assets/images/home", width: 1600, quality: 70 },
  { dir: "src/assets/images/galeria", width: 1200, quality: 72 },
  { dir: "src/assets/images/logos", width: 700, quality: 80 },
];

for (const t of TARGETS) {
  const dir = join(ROOT, t.dir);
  for (const file of readdirSync(dir)) {
    if (!/\.(webp|png|jpe?g)$/i.test(file)) continue;
    const src = join(dir, file);
    const input = readFileSync(src);
    const data = await sharp(input)
      .rotate()
      .resize({ width: t.width, withoutEnlargement: true })
      .webp({ quality: t.quality })
      .toBuffer();
    await rmWithRetry(src);
    writeFileSync(src, data);
    console.log(`ok ${t.dir}/${file} -> ${Math.round(data.length / 1024)} KB`);
  }
}

console.log("Images optimized");