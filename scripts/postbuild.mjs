// Creates a copy of index.html inside every route folder so that each of the
// eight routes works on direct URL navigation on any plain static web server
// (no rewrite rules needed). Asset paths are rewritten to point one level up.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const routes = ['objective-setting', 'mid-year', 'year-end', 'knowledge-center', 'ai-prompts', 'learning-nuggets', 'competency-goal-guide'];
const dist = 'dist';
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const nested = html.replaceAll('"./', '"../');
for (const r of routes) {
  mkdirSync(join(dist, r), { recursive: true });
  writeFileSync(join(dist, r, 'index.html'), nested);
}
// Generic fallback for servers that support a 404 page at the site root.
writeFileSync(join(dist, '404.html'), html);
console.log(`postbuild: created ${routes.length} route entry points + 404.html`);
