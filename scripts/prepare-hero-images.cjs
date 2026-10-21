const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

// Usage: node scripts/prepare-hero-images.cjs landscape.png portrait.png
async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.length !== 2) throw new Error('Provide landscape and portrait source files.');
  const output = path.join(__dirname, '..', 'public', 'img', 'hero');
  fs.mkdirSync(output, { recursive: true });
  for (const [index, orientation] of ['landscape', 'portrait'].entries()) {
    const source = sharp(inputs[index]).rotate();
    const metadata = await source.metadata();
    const widths = orientation === 'landscape' ? [768, 1024, 1440, metadata.width] : [320, 480, 768, metadata.width];
    for (const width of [...new Set(widths)].filter(width => width <= metadata.width)) {
      for (const format of ['avif', 'webp']) {
        const image = source.clone().resize({ width, withoutEnlargement: true });
        if (format === 'avif') image.avif({ quality: 60, effort: 5 });
        else image.webp({ quality: 84 });
        await image.toFile(path.join(output, `${orientation}-${width}.${format}`));
      }
    }
    console.log(`${orientation}: ${metadata.width}x${metadata.height}; optimized AVIF/WebP variants saved.`);
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
