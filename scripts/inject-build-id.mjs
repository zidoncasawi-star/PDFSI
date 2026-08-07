// Stamps dist/index.html with the short git commit hash so a deploy can be
// verified with a single request instead of guessing from Last-Modified/
// Cache-Control headers: `curl -s https://signpdf.site/ | grep build-id`.
// Runs before prerender.mjs (see package.json "postbuild") so the hash is
// already baked in when each route gets snapshotted.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

let hash = 'unknown';
try {
  hash = execSync('git rev-parse --short HEAD', { cwd: path.join(__dirname, '..') }).toString().trim();
} catch {
  // Not a git checkout (e.g. a downloaded zip) — leave 'unknown' rather than fail the build.
}

const html = readFileSync(indexPath, 'utf8').replace('__BUILD_HASH__', hash);
writeFileSync(indexPath, html, 'utf8');
console.log(`stamped build-id: ${hash}`);
