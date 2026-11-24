/** Prints docs/sitemap-wireframes/build/index.html to PDF and exports the sitemap diagram as PNG. */
const { chromium } = require('playwright');
const path = require('path');

const OUT = process.argv[2] || 'docs/sitemap-wireframes';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.resolve(OUT, 'build/index.html'), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(OUT, 'DOUGLASDialogue-Hub_Sitemap-Wireframes.pdf'), preferCSSPageSize: true, printBackground: true });
  await p.emulateMedia({ media: 'print' });
  await p.locator('.sheet--tree').screenshot({ path: path.join(OUT, 'Sitemap-Diagram.png') });
  await b.close();
})();
