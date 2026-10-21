const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

// Source files stay untouched. Accept ordinary raster images as well as the
// original exported SVG (whose embedded JPEG is extracted before processing).
async function main() {
  const [desktopFile, mobileFile] = process.argv.slice(2);
  if (!desktopFile || !mobileFile) throw new Error('Usage: node scripts/prepare-hero-lighting.cjs desktop-image mobile-image');
  const rasterInput = file => {
    if (path.extname(file).toLowerCase() !== '.svg') return file;
    const svg = fs.readFileSync(file, 'utf8');
    const embedded = svg.match(/(?:href)="data:image\/(?:jpeg|png);base64,([^"]+)"/);
    if (!embedded) throw new Error('SVG source must contain an embedded JPEG or PNG image.');
    return Buffer.from(embedded[1], 'base64');
  };
  const output = path.join(__dirname, '..', 'public', 'img', 'hero', 'lighting');
  fs.mkdirSync(output, { recursive: true });
  const manifest = [];
  for (const [art, input, requestedWidths] of [
    ['desktop', rasterInput(desktopFile), [768, 1280, 1920, 2560, 3840]],
    ['mobile', rasterInput(mobileFile), [320, 480, 768, 1080, 1440, 2160]],
  ]) {
    const image = sharp(input);
    const metadata = await image.metadata();
    const widths = [...new Set([...requestedWidths.filter(width => width < metadata.width), metadata.width])];
    for (const width of widths) {
      for (const format of ['avif', 'webp']) {
        const filename = `${art}-${width}.${format}`;
        const resized = image.clone().resize({ width, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 });
        if (format === 'avif') resized.avif({ quality: 72, effort: 7, chromaSubsampling: '4:4:4' });
        else resized.webp({ quality: 88, effort: 6, smartSubsample: true });
        await resized.toFile(path.join(output, filename));
        manifest.push({ file: filename, width, bytes: fs.statSync(path.join(output, filename)).size });
      }
    }
    // Small inspection references, outside the public payload.
    await image.clone().resize({ width: art === 'desktop' ? 1536 : 864 }).png().toFile(path.join(__dirname, '..', 'docs', 'screenshots', `lighting-source-${art}.png`));
  }
  fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(manifest);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
