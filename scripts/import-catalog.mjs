import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogFile = path.join(root, 'src/data/products.json');
const metaFile = path.join(root, 'src/data/images-meta.json');
import { validateCatalog } from './catalog-schema.cjs';
async function run() {
  const input = process.argv[2];
  const write = process.argv.includes('--write');
  if (input === '--help') { console.log('node scripts/import-catalog.mjs [owner-catalog.json] [--write]\nDefault validates existing catalog. Without --write, import is a dry run. assetPath resolves relative to the owner JSON.'); return; }
  const file = input && !input.startsWith('--') ? path.resolve(input) : catalogFile;
  const rows = JSON.parse(await fs.readFile(file, 'utf8'));
  const metadata = JSON.parse(await fs.readFile(metaFile, 'utf8'));
  validateCatalog(rows, metadata);
  // Read and decode every source before writing any output.
  const prepared = [];
  for (const item of rows) {
    if (item.assetPath) {
      const original = await fs.readFile(path.resolve(path.dirname(file), item.assetPath));
      const { data: buffer, info } = await sharp(original).rotate().toBuffer({ resolveWithObject: true });
      if (!info.width || !info.height) throw new Error(`${item.id}: invalid image`);
      prepared.push({ item, buffer, info, digest: crypto.createHash('sha256').update(original).digest('hex') });
    } else {
      for (const [format, files] of Object.entries(metadata[item.image].files)) {
        for (const imagePath of typeof files === 'string' ? [files] : Object.values(files)) {
          const resolved = path.resolve(root, 'public', imagePath.replace(/^\/+/, ''));
          if (!resolved.startsWith(path.join(root, 'public') + path.sep)) throw new Error('Asset path escapes public directory');
          await fs.access(resolved);
        }
      }
    }
  }
  if (write) {
    const duplicates = new Map(Object.entries(metadata).filter(([, value]) => value.sha256).map(([key, value]) => [value.sha256, key]));
    for (const { item, buffer, info, digest } of prepared) {
      if (duplicates.has(digest)) { item.image = duplicates.get(digest); delete item.assetPath; continue; }
      const key = `product-${item.id}-${digest.slice(0, 12)}`;
      const files = { webp: {}, avif: {}, fallback: `/img/${key}.webp` };
      await fs.mkdir(path.join(root, 'public/img'), { recursive: true });
      await sharp(buffer).rotate().webp({ quality: 85 }).toFile(path.join(root, 'public', files.fallback));
      for (const width of [320, 480, 640, 1024, 1600].filter(w => w <= info.width)) {
        for (const format of ['webp', 'avif']) {
          const url = `/img/${key}-${width}w.${format}`;
          await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).toFormat(format, { quality: format === 'avif' ? 65 : 82 }).toFile(path.join(root, 'public', url));
          files[format][width] = url;
        }
      }
      metadata[key] = { originalWidth: info.width, originalHeight: info.height, aspectRatio: info.width / info.height, sha256: digest, source: item.source, sourceUrl: item.verifiedSourceUrl, files };
      item.image = key; delete item.assetPath; duplicates.set(digest, key);
    }
    await fs.writeFile(metaFile, JSON.stringify(metadata, null, 2) + '\n');
    await fs.writeFile(catalogFile, JSON.stringify(rows, null, 2) + '\n');
  }
  console.log(`${write ? 'Imported' : 'Validated (no writes)'} ${rows.length} products; ${prepared.length} source images. Source verification remains the owner's responsibility.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) run().catch(error => { console.error(error.message); process.exitCode = 1; });
