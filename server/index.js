const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { resolve, relative, extname, sep } = require('node:path');
const { handleCatalog } = require('./indiarestros');

const dist = resolve(__dirname, '../dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  if (req.url.startsWith('/api/food/')) return handleCatalog(req, res);
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    const path = decodeURIComponent(pathname);
    const file = resolve(dist, `.${extname(path) ? path : '/index.html'}`);
    const inside = relative(dist, file);
    if (inside === '..' || inside.startsWith(`..${sep}`)) throw new Error('Invalid path');
    const asset = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(asset);
  } catch {
    res.writeHead(404).end('File not found');
  }
}).listen(process.env.PORT || 1234, process.env.HOST || '127.0.0.1', function () {
  console.log(`FoodHub is running on port ${this.address().port}`);
});
