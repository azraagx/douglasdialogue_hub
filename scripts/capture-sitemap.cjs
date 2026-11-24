/**
 * Captures numbered full-page screenshots + wireframes of every page and key state
 * of the #DOUGLASDialogue Hub, and writes the sitemap structure to sitemap.json.
 *
 * Usage: serve dist/ (e.g. at http://localhost:8765/hub) and run
 *   node scripts/capture-sitemap.cjs http://localhost:8765/hub docs/sitemap-wireframes
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:8765/hub';
const OUT = process.argv[3] || 'docs/sitemap-wireframes';

const PAGES = [
  { n: 1, title: 'Dialogue Dashboard', route: '/', group: 'Dashboard' },
  { n: 2, title: 'Objective Setting', route: '/objective-setting', group: 'Dialogue Phases' },
  { n: 3, title: 'Mid-Year Dialogue', route: '/mid-year', group: 'Dialogue Phases' },
  { n: 4, title: 'Year-End Dialogue', route: '/year-end', group: 'Dialogue Phases' },
  { n: 5, title: 'Knowledge Center', route: '/knowledge-center', group: 'Resources' },
  { n: 6, title: 'AI Prompt Library', route: '/ai-prompts', group: 'Resources' },
  { n: 7, title: 'Learning Nuggets', route: '/learning-nuggets', group: 'Resources' },
  { n: 8, title: 'Competency & Goal Guide', route: '/competency-goal-guide', group: 'Resources' },
];

/** Detail views (URL-addressable) and overlay states. */
const STATES = [
  { id: '0.4', page: 0, title: 'Navigation dropdown “Dialogue Phases”', route: '/', open: async (p) => { await p.getByRole('button', { name: /Dialogue Phases/ }).click(); }, el: '#phase-menu' },
  { id: '0.5', page: 0, title: 'Language menu (EN active · DE not available yet)', route: '/', open: async (p) => { await p.getByRole('button', { name: /Change language/ }).click(); await p.getByRole('button', { name: /Deutsch/ }).click({ force: true }); }, el: '.lang .popover' },
  { id: '0.6', page: 0, title: 'Search panel (popular searches & recommendations)', route: '/', open: async (p) => { await p.locator('.search-trigger').click(); }, el: '.search-panel__sheet' },
  { id: '0.7', page: 0, title: 'Search panel with live results', route: '/', open: async (p) => { await p.locator('.search-trigger').click(); await p.fill('#hub-search', 'feedback'); }, el: '.search-panel__sheet' },
  { id: '0.8', page: 0, title: 'Dialogue Guide (assistant side sheet)', route: '/', open: async (p) => { await p.getByRole('button', { name: 'Open Dialogue Guide assistant' }).click(); await p.waitForTimeout(400); await p.locator('.quick .chip').first().click(); await p.waitForTimeout(900); }, el: '.assistant__panel', keepLauncher: true },
  { id: '0.9', page: 0, title: 'Mobile navigation (390 px)', route: '/', mobile: true, open: async (p) => { await p.getByRole('button', { name: 'Open menu' }).click(); }, el: '.mobile-nav__panel' },
  { id: '4.D1', page: 4, title: 'Competency detail drawer (from Year-End)', route: '/year-end#competencies', open: async (p) => { await p.locator('.comp-mini__item').first().click(); }, el: '.drawer__panel' },
  { id: '5.D1', page: 5, title: 'Knowledge article view (drawer)', route: '/knowledge-center?item=sap-steps', el: '.drawer__panel' },
  { id: '5.D2', page: 5, title: 'FAQ expanded (accordion)', route: '/knowledge-center?item=smart', el: '#kc-smart' },
  { id: '6.D1', page: 6, title: 'Prompt opened via search / deep link', route: '/ai-prompts?prompt=feedback', el: '.prompt-card.is-target' },
  { id: '8.D1', page: 8, title: 'Core Competency detail drawer', route: '/competency-goal-guide?competency=teamwork', el: '.drawer__panel' },
  { id: '8.D2', page: 8, title: 'Leadership Competency detail drawer', route: '/competency-goal-guide?competency=direction', el: '.drawer__panel' },
];

/** Full-page detail views (Learning Nugget reader). */
const READERS = [
  { id: '7.D1', page: 7, title: 'Nugget reader: How to write a SMART objective', route: '/learning-nuggets?nugget=smart' },
  { id: '7.D2', page: 7, title: 'Nugget reader: Preparing for a Dialogue', route: '/learning-nuggets?nugget=prepare' },
  { id: '7.D3', page: 7, title: 'Nugget reader: Giving Meaningful Feedback', route: '/learning-nuggets?nugget=feedback' },
];

const NAME_OVERRIDES = { kc: 'Filters, results, FAQs & guides', prompts: 'Filters, prompt cards & how to use', 'welcome-strip': 'Welcome strip (role-dependent)' };

const WF_CSS = `
html.wf { filter: grayscale(1); }
html.wf body { background: #fff !important; }
.wf :where(*) { background-color: transparent !important; background-image: none !important; color: #4a4a4a !important; box-shadow: none !important; text-shadow: none !important; border-color: #b0b0b0 !important; animation: none !important; transition: none !important; }
.wf .section--stone, .wf .section--mint, .wf .section--dark, .wf .info-bar, .wf .welcome-strip, .wf .site-footer, .wf .hero__mint,
.wf .page-hero--mint, .wf .timeline__panel-side, .wf .featured__card, .wf .search-trigger, .wf .assistant__head, .wf .bubble--guide,
.wf .info-tile--mint, .wf .obj-col, .wf .type-card--dark, .wf .module-card--1, .wf .module-card--2, .wf .aside-note, .wf .how,
.wf .reflect-card--dark, .wf .prep-card--guide, .wf .privacy-banner, .wf .callout--mint, .wf .example--clear, .wf .lead-card,
.wf .rating-card--wide, .wf .reader__end, .wf .prompt-card__text, .wf .drawer__backdrop, .wf .search-panel__backdrop, .wf .mobile-nav__backdrop { background-color: #efefef !important; }
.wf .drawer__backdrop, .wf .search-panel__backdrop, .wf .mobile-nav__backdrop { background-color: rgba(0,0,0,.25) !important; }
.wf .site-header, .wf .site-header__inner { background-color: #fff !important; }
.wf .drawer__panel, .wf .search-panel__sheet, .wf .assistant__panel, .wf .mobile-nav__panel, .wf .popover .lang-panel, .wf .dropdown { background-color: #fff !important; border: 1px solid #888 !important; }
.wf .btn--dark, .wf .btn--primary, .wf .btn--success, .wf .role-switch__thumb, .wf .seg button.is-active, .wf .chip.is-active, .wf .smart__letter.is-active,
.wf .next-card__n, .wf .prompt-card__n, .wf .change-flow__n, .wf .timeline__step.is-past .timeline__dot, .wf .timeline__step.is-active .timeline__dot,
.wf .tag--dark, .wf .sap-badge, .wf .sap-chip span, .wf .support-card__icon--sap, .wf .bubble--user, .wf .assistant__send, .wf .check.is-checked .check__box,
.wf .eval__seg--0, .wf .lang__btn[aria-expanded='true'], .wf .num-list li::before, .wf .dropdown__num, .wf .assistant__avatar, .wf .assistant-launcher__icon { background-color: #8a8a8a !important; color: #fff !important; }
.wf .btn--dark *, .wf .btn--primary *, .wf .seg button.is-active *, .wf .smart__letter.is-active *, .wf .bubble--user *, .wf .assistant__send *, .wf .role-switch__track button.is-active, .wf .lang__btn[aria-expanded='true'] * { color: #fff !important; }
.wf .eval__seg--1, .wf .eval__seg--2, .wf .tag, .wf .checklist__ring, .wf .module-card__icon, .wf .support-card__icon, .wf .phase-card__num { background-color: #d6d6d6 !important; }
.wf .hero__title-accent::after { background: #cfcfcf !important; }
.wf .phase-card__num { color: #fff !important; background: transparent !important; }
.wf .page-hero--light .page-hero__media, .wf .page-hero--mint .page-hero__media { box-shadow: 14px 14px 0 #d9d9d9 !important; }
.wf .donut__seg { stroke: #9a9a9a !important; } .wf .eval__stroke--1 { stroke: #c4c4c4 !important; } .wf .eval__stroke--2 { stroke: #6e6e6e !important; }
`;

async function settle(p, ms = 900) { await p.waitForLoadState('networkidle'); await p.waitForTimeout(ms); }

/** Collects global + page sections with positions and names. */
async function collect(p, pageNo) {
  return p.evaluate(({ pageNo, NAME_OVERRIDES }) => {
    const items = [];
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const nameOf = (el) => {
      for (const [cls, name] of Object.entries(NAME_OVERRIDES)) if (el.classList.contains(cls)) return name;
      if (el.classList.contains('hero') || el.classList.contains('page-hero')) return `Hero — ${txt(el.querySelector('h1'))}`;
      if (el.classList.contains('featured')) return `Featured Learning Nugget — ${txt(el.querySelector('h2'))}`;
      if (el.classList.contains('reader-wrap')) return 'Nugget reader';
      const eb = txt(el.querySelector('.section__head .eyebrow'));
      const h = txt(el.querySelector('.section__head h2')) || txt(el.querySelector('h1, h2'));
      return eb && h ? `${eb} — ${h}` : (h || eb || el.className);
    };
    const add = (el, num, name, kind) => {
      const r = el.getBoundingClientRect();
      if (r.height < 4) return;
      items.push({ num, name, kind, id: el.id || '', top: r.top + scrollY, left: r.left, width: r.width, height: r.height, text: el.textContent.replace(/\s+/g, ' ').trim() });
    };
    add(document.querySelector('.info-bar'), '0.1', 'Service bar (current phase)', 'global');
    add(document.querySelector('.site-header'), '0.2', 'Header — logo, search, role switch, language, main navigation', 'global');
    let i = 0;
    document.querySelectorAll('main > *').forEach((el) => { i += 1; add(el, `${pageNo}.${i}`, nameOf(el), 'section'); });
    add(document.querySelector('.site-footer'), '0.3', 'Footer', 'global');
    return items;
  }, { pageNo, NAME_OVERRIDES });
}

/** Draws numbered outlines + badges directly into the page. */
async function annotate(p, items, wire) {
  await p.evaluate(({ items, wire }) => {
    document.getElementById('ann-layer')?.remove();
    const layer = document.createElement('div');
    layer.id = 'ann-layer';
    layer.className = 'ann';
    layer.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:0;z-index:2147483000;pointer-events:none;';
    // Annotation styles are !important so the wireframe stylesheet never restyles them.
    const imp = (css) => css.split(';').filter((d) => d.trim()).map((d) => `${d} !important`).join(';');
    for (const it of items) {
      const box = document.createElement('div');
      const color = it.kind === 'global' ? '#5e534e' : '#000';
      box.style.cssText = imp(`position:absolute;left:${it.left + 3}px;top:${it.top + 3}px;width:${it.width - 6}px;height:${it.height - 6}px;border:4px ${wire ? 'dashed' : 'solid'} ${color};box-sizing:border-box;`);
      const badge = document.createElement('div');
      badge.style.cssText = imp(`position:absolute;left:-2px;top:-2px;display:flex;gap:8px;align-items:center;padding:8px 14px;background:${color};color:#fff;font:600 24px/1.2 'Nunito Sans Variable',sans-serif;letter-spacing:.04em;max-width:${Math.max(320, it.width - 20)}px;`);
      badge.innerHTML = `<span style="color:${wire ? '#fff' : '#9BDCD2'} !important;font-weight:800;font-size:28px">${it.num}</span><span style="color:#fff !important">${it.name.replace(/</g, '&lt;')}</span>`;
      box.appendChild(badge);
      layer.appendChild(box);
    }
    document.body.appendChild(layer);
  }, { items, wire });
}

async function wireframe(p) {
  await p.addStyleTag({ content: WF_CSS });
  await p.evaluate(() => {
    document.documentElement.classList.add('wf');
    document.querySelectorAll('img').forEach((img) => {
      if (img.closest('.ann')) return;
      const r = img.getBoundingClientRect();
      const d = document.createElement('div');
      d.className = 'wf-img';
      const cs = getComputedStyle(img);
      const set = (k, v) => d.style.setProperty(k, v, 'important');
      set('width', `${r.width}px`); set('height', `${r.height}px`); set('display', cs.display === 'inline' ? 'inline-block' : cs.display);
      set('background', 'linear-gradient(to top right, transparent calc(50% - 1px), #b8b8b8 50%, transparent calc(50% + 1px)), linear-gradient(to bottom right, transparent calc(50% - 1px), #b8b8b8 50%, transparent calc(50% + 1px)), #e4e4e4');
      set('align-items', 'center'); set('justify-content', 'center');
      if (r.width > 60 && r.height > 40) { const l = document.createElement('span'); l.textContent = 'IMAGE'; l.style.cssText = 'font:600 11px sans-serif;letter-spacing:.14em;color:#8a8a8a;background:#e4e4e4;padding:2px 6px;'; d.appendChild(l); if (getComputedStyle(img).display !== 'none') set('display', 'flex'); }
      set('border', '1px solid #b8b8b8'); set('box-sizing', 'border-box'); set('flex', 'none');
      if (cs.position === 'absolute') { set('position', 'absolute'); set('inset', '0'); }
      img.replaceWith(d);
    });
  });
  await p.waitForTimeout(150);
}

(async () => {
  fs.mkdirSync(path.join(OUT, 'screens'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'wireframes'), { recursive: true });
  const browser = await chromium.launch();
  const desk = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' };
  const result = { pages: [], states: [] };
  const hideLauncher = '.assistant-launcher{display:none!important}';

  const fullPage = async (entry, route, pageNo, customItems) => {
    const ctx = await browser.newContext(desk);
    const p = await ctx.newPage();
    const slug = entry.slug;
    // Role-dependent detection: capture section texts in both roles.
    await p.goto(BASE + route); await settle(p);
    await p.evaluate(() => sessionStorage.setItem('ddh.role', '"manager"'));
    await p.reload(); await settle(p);
    const managerItems = await collect(p, pageNo);
    await p.evaluate(() => sessionStorage.setItem('ddh.role', '"employee"'));
    await p.reload(); await settle(p);
    await p.addStyleTag({ content: hideLauncher });
    let items = await collect(p, pageNo);
    if (customItems) {
      const extra = await p.evaluate((list) => list.map(([sel, num, name]) => {
        const el = document.querySelector(sel); const r = el.getBoundingClientRect();
        return { num, name, kind: 'section', id: '', top: r.top + scrollY, left: r.left, width: r.width, height: r.height, text: '' };
      }), customItems);
      items = items.filter((x) => x.kind === 'global').concat(extra);
    }
    items.forEach((it) => {
      const m = managerItems.find((x) => x.num === it.num);
      it.roleDependent = it.kind === 'section' && !!m && m.text !== it.text;
      delete it.text;
    });
    const height = await p.evaluate(() => document.documentElement.scrollHeight);
    await annotate(p, items, false);
    await p.screenshot({ path: path.join(OUT, 'screens', `${slug}.jpg`), fullPage: true, type: 'jpeg', quality: 82 });
    await wireframe(p);
    await annotate(p, items, true);
    await p.screenshot({ path: path.join(OUT, 'wireframes', `${slug}.jpg`), fullPage: true, type: 'jpeg', quality: 82 });
    await ctx.close();
    return { items, height };
  };

  for (const pg of PAGES) {
    const slug = `${String(pg.n).padStart(2, '0')}-${pg.route === '/' ? 'dashboard' : pg.route.slice(1)}`;
    const { items, height } = await fullPage({ slug }, pg.route, pg.n);
    result.pages.push({ ...pg, slug, height, items });
    console.log('page', slug, items.length, 'areas');
  }

  for (const r of READERS) {
    const slug = r.id.replace('.', '-') + '-' + r.route.split('=')[1];
    const { items, height } = await fullPage({ slug }, r.route, r.page, [
      ['.reader__bar', `${r.id}.1`, 'Back to overview & reading time'],
      ['.reader__aside', `${r.id}.2`, 'Cover image, title & section navigation'],
      ['.reader__main', `${r.id}.3`, 'Progress bar, lesson content & Back / Next'],
    ]);
    result.states.push({ ...r, slug, full: true, height, items });
    console.log('reader', slug);
  }

  for (const s of STATES) {
    const ctx = await browser.newContext(s.mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' } : desk);
    const p = await ctx.newPage();
    await p.goto(BASE + s.route); await settle(p, 1100);
    if (!s.keepLauncher) await p.addStyleTag({ content: hideLauncher });
    if (s.open) { await s.open(p); await p.waitForTimeout(700); }
    const vp = p.viewportSize();
    const box = await p.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { top: r.top + scrollY, left: r.left, width: r.width, height: Math.min(r.height, innerHeight - r.top) }; }, s.el);
    const items = [{ num: s.id, name: s.title, kind: 'section', ...box }];
    const slug = s.id.replace('.', '-') + '-' + s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    await annotate(p, items, false);
    await p.screenshot({ path: path.join(OUT, 'screens', `${slug}.jpg`), type: 'jpeg', quality: 85 });
    await wireframe(p);
    await annotate(p, items, true);
    await p.screenshot({ path: path.join(OUT, 'wireframes', `${slug}.jpg`), type: 'jpeg', quality: 85 });
    result.states.push({ id: s.id, page: s.page, title: s.title, route: s.route, slug, mobile: !!s.mobile, width: vp.width, height: vp.height });
    console.log('state', slug);
    await ctx.close();
  }

  fs.writeFileSync(path.join(OUT, 'sitemap.json'), JSON.stringify(result, null, 2));
  await browser.close();
})();
