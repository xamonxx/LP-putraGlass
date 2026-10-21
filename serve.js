/**
 * Server Statis Cepat dengan Gzip Compression untuk Audit Lighthouse & Preview
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3333;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = path.resolve(__dirname, 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.hdr': 'application/octet-stream',
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

  let statusCode = 200;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    statusCode = 404;
    filePath = path.join(ROOT, '404.html');
    if (!fs.existsSync(filePath)) { res.writeHead(404); return res.end('Not found'); }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  const stat = fs.statSync(filePath);
  const isCompressible = /\.(html|css|js|json|svg|xml|txt)$/i.test(ext);

  res.setHeader('Content-Type', contentType);
  res.statusCode = statusCode;
  // HTML selalu dicek ulang; aset ber-hash di /_next/static boleh di-cache lama.
  const isImmutable = filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`);
  res.setHeader('Cache-Control', /\.(html|txt|xml)$/.test(ext) ? 'no-cache' : isImmutable ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');

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

server.listen(PORT, HOST, () => {
  console.log(`Static server with gzip running at http://${HOST}:${PORT}/ (serving ${ROOT})`);
});
