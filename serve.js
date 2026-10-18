/**
 * Server Statis Cepat dengan Gzip Compression untuk Audit Lighthouse & Preview
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3333;
const ROOT = path.resolve(__dirname, 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath;
  try {
    reqPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }
  if (reqPath === '/' || reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  // Cegah path traversal (../) keluar dari folder out/
  let filePath = path.normalize(path.join(ROOT, reqPath));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  const stat = fs.statSync(filePath);
  const isCompressible = /\.(html|css|js|json|svg)$/i.test(ext);

  res.setHeader('Content-Type', contentType);
  // HTML selalu dicek ulang; aset ber-hash di /_next/static boleh di-cache lama.
  const isImmutable = filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`);
  res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : isImmutable ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');

  if (isCompressible && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = zlib.createGzip({ level: 6 });
    const raw = fs.createReadStream(filePath);
    raw.pipe(gzip).pipe(res);
  } else {
    res.setHeader('Content-Length', stat.size);
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static server with gzip running at http://localhost:${PORT}/ (serving ${ROOT})`);
});
