const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

// Replaces catalogue renders with the studio renders in aset-img-for-website/.
// Sources stay untouched; crops are normalised (0–1) boxes framing each mirror on the wall.
// Usage: node scripts/import-site-assets.cjs [--preview <dir>]
const root = path.join(__dirname, '..');
const source = path.join(root, 'aset-img-for-website');
const assets = [
  { name: 'model-capsul', file: 'SUNBLAST/SUNBLAST - CAPSULE.png', crop: [.22, .085, .72, .72] },
  { name: 'model-rectangle', file: 'SUNBLAST/SUNBLAST - RECTANGLE.png', crop: [.24, .085, .66, .66] },
  // The Sunblast leaf is only 1080×1350 and letterboxed; the 4000 px clear-glass render stays sharp on detail pages.
  { name: 'model-leaf', file: 'NO SUNBLAST/NO SANBLAST - LEAF.jpg', crop: [.33, .15, .52, .52] },
  { name: 'model-halfmoon', file: 'SUNBLAST/SANBLAST - WIDE HALF MOON.jpg', crop: [.235, .08, .76, .76] },
  { name: 'custom-octagon', file: 'SUNBLAST/SANBLAST - WIDE HEX.jpg', crop: [.21, .18, .72, .54] },
  { name: 'model-oval', file: 'SUNBLAST/ovall.png', crop: [.235, .145, .64, .64] },
  { name: 'model-round', file: 'SUNBLAST/SUNBLAST - ROUND.png', crop: [.25, .06, .62, .62] },
];
const widths = [320, 480, 640, 1024, 1600];

// Windows (indexer/antivirus) can briefly lock a file that was just overwritten; encode first, then retry the write.
async function save(pipeline, file) {
  const data = await pipeline.toBuffer();
  for (let attempt = 0; ; attempt++) {
    try { fs.writeFileSync(file, data); return; }
    catch (error) { if (attempt >= 5) throw error; await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1))); }
  }
}

async function main() {
  const previewIndex = process.argv.indexOf('--preview');
  const preview = previewIndex > -1 ? process.argv[previewIndex + 1] : null;
  const metaPath = path.join(root, 'src', 'data', 'images-meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  for (const { name, file, crop } of assets) {
    const input = path.join(source, file);
    const { width: w, height: h } = await sharp(input).metadata();
    const [x, y, cw, ch] = crop;
    const box = { left: Math.round(x * w), top: Math.round(y * h), width: Math.round(cw * w), height: Math.round(ch * h) };
    const cropped = await sharp(input).extract(box).flatten({ background: '#f4efe8' }).toBuffer();
    const outWidth = Math.min(1600, box.width), outHeight = Math.round(outWidth * box.height / box.width);
    if (preview) { await sharp(cropped).resize({ width: 480 }).jpeg({ quality: 80 }).toFile(path.join(preview, `${name}.jpg`)); continue; }
    const base = sharp(cropped).resize({ width: outWidth });
    const files = { webp: {}, avif: {}, fallback: `/assets/${name}.webp` };
    for (const width of widths.filter(width => width <= outWidth)) {
      for (const format of ['webp', 'avif']) {
        const rel = `/img/${name}-${width}w.${format}`;
        await save(base.clone().resize({ width })[format](format === 'webp' ? { quality: 78, effort: 6 } : { quality: 55, effort: 6 }), path.join(root, 'public', rel));
        files[format][width] = rel;
      }
    }
    for (const format of ['webp', 'avif']) {
      const rel = `/img/${name}.${format}`;
      await save(base.clone()[format](format === 'webp' ? { quality: 78, effort: 6 } : { quality: 55, effort: 6 }), path.join(root, 'public', rel));
      files[format].default = rel;
    }
    await save(base.clone().webp({ quality: 78, effort: 6 }), path.join(root, 'public', 'assets', `${name}.webp`));
    await save(base.clone().jpeg({ quality: 82, mozjpeg: true }), path.join(root, 'public', 'assets', `${name}.jpg`));
    meta[name] = { originalWidth: outWidth, originalHeight: outHeight, aspectRatio: +(outWidth / outHeight).toFixed(4), files };
    console.log(name, `${outWidth}x${outHeight}`, 'from', file);
  }
  if (!preview) fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
