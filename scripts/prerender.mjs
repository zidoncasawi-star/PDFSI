// Runs after `vite build` (see package.json "postbuild"). Snapshots the
// client-rendered HTML for each public marketing route into
// dist/<route>/index.html, so crawlers that don't execute JS (Facebook,
// WhatsApp, LinkedIn, most search/AI bots) see real content instead of the
// empty SPA shell. React still mounts fresh on top in real browsers
// (main.tsx uses createRoot, not hydrateRoot), so this is a snapshot, not
// a hydration handoff — no risk of hydration-mismatch warnings.
//
// CI note: this relies on a Chromium binary matching the pinned `playwright`
// version in package.json. A machine that has never run Playwright needs an
// explicit `npx playwright install --with-deps chromium` step (with that
// cache dir cached between CI runs) before `npm run build`.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const ROUTES = ['/', '/download', '/faq', '/contact', '/activate', '/legal', '/terms', '/privacy'];

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function poll() {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() - start > timeoutMs) reject(new Error('preview server did not start in time'));
          else setTimeout(poll, 300);
        });
    })();
  });
}

async function main() {
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(BASE);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    for (const route of ROUTES) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
      await page.waitForFunction(() => (document.getElementById('root')?.children.length ?? 0) > 0);
      await page.waitForTimeout(300); // let Seo.tsx's effect finish updating <head> tags

      const hasH1 = await page.evaluate(() => Boolean(document.querySelector('h1')?.textContent?.trim()));
      if (!hasH1) {
        throw new Error(`Prerender check failed for ${route}: no <h1> with text found in the rendered page. Refusing to ship a possibly-empty snapshot.`);
      }

      const html = await page.content();

      const outDir = route === '/' ? distDir : path.join(distDir, route.slice(1));
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
      console.log(`prerendered ${route} -> ${path.relative(distDir, path.join(outDir, 'index.html')) || 'index.html'}`);
    }

    await browser.close();
  } finally {
    preview.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
