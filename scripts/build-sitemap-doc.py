"""
Builds the Sitemap & Wireframes document (HTML, printed to PDF by print-sitemap.cjs)
from docs/sitemap-wireframes/sitemap.json and the captured screens/wireframes.

Usage: python3 scripts/build-sitemap-doc.py docs/sitemap-wireframes
"""
import html
import json
import os
import sys
from datetime import date

from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else 'docs/sitemap-wireframes'
BUILD = os.path.join(OUT, 'build')
os.makedirs(os.path.join(BUILD, 'img'), exist_ok=True)
data = json.load(open(os.path.join(OUT, 'sitemap.json')))
E = html.escape

GLOBAL = [
    ('0.1', 'Service bar (current phase)', 'every page', 'Mint bar above the header: cycle, current phase with link, SAP hint'),
    ('0.2', 'Header', 'every page', 'Logo → Dashboard · search field · role switch (Employee/Manager, demo) · language button EN · main navigation'),
    ('0.3', 'Footer', 'every page', 'Claim, links to phases and resources, support contact, privacy note'),
    ('0.4', 'Navigation dropdown “Dialogue Phases”', 'overlay', 'Objective Setting · Mid-Year Dialogue · Year-End Dialogue'),
    ('0.5', 'Language menu', 'overlay', 'EN English (active) · DE Deutsch (not available yet)'),
    ('0.6', 'Search panel', 'overlay', 'Popular searches and recommended Learning Nuggets'),
    ('0.7', 'Search panel with live results', 'overlay', 'Results grouped: pages, FAQs & guides, prompts, nuggets, competencies'),
    ('0.8', 'Dialogue Guide', 'overlay', 'Guided assistant side sheet, bottom-right launcher on every page'),
    ('0.9', 'Mobile navigation', 'overlay · mobile', 'Menu drawer with role switch, all pages and language'),
]

TRIGGERS = {
    '0.4': 'Header → “Dialogue Phases”', '0.5': 'Header → “EN”, then “DE”', '0.6': 'Header → search field',
    '0.7': 'Search panel → type “feedback”', '0.8': 'Launcher “Dialogue Guide” (bottom right) → suggestion',
    '0.9': 'Mobile header → menu icon', '4.D1': 'Year-End 4.5 → competency tile',
    '5.D1': 'Knowledge Center → guide card · URL ?item=sap-steps', '5.D2': 'Knowledge Center → FAQ · URL ?item=smart',
    '6.D1': 'Search result or URL ?prompt=feedback', '8.D1': 'Core competency card · URL ?competency=teamwork',
    '8.D2': 'Leadership card · URL ?competency=direction',
    '7.D1': 'Learning Nuggets 7.2 → “Start Nugget” · URL ?nugget=smart', '7.D2': 'URL ?nugget=prepare', '7.D3': 'URL ?nugget=feedback',
}

pages = data['pages']
states = data['states']
details = {}
for s in states:
    details.setdefault(s['page'], []).append(s)


def short(name):
    head = name.split(' — ')[0]
    return 'Hero' if head == 'Hero' else head


def anchor(route, item_id):
    return f"{route}#{item_id}" if item_id else ''


# ---------------- image slicing ----------------
IMG_W_MM, IMG_H_MM, PX_OUT = 107.5, 166.0, 1400


def slices(slug, kind):
    src = Image.open(os.path.join(OUT, kind, f'{slug}.jpg')).convert('RGB')
    w, h = src.size
    step = int(w * IMG_H_MM / IMG_W_MM)
    out = []
    for i, y in enumerate(range(0, h, step)):
        part = src.crop((0, y, w, min(h, y + step)))
        part = part.resize((PX_OUT, int(part.height * PX_OUT / w)), Image.LANCZOS)
        name = f'{kind}-{slug}-{i + 1}.jpg'
        part.save(os.path.join(BUILD, 'img', name), quality=84, optimize=True)
        out.append((name, y / 2, min(h, y + step) / 2))  # css px (screens are 2x)
    return out


def single(slug, kind):
    src = Image.open(os.path.join(OUT, kind, f'{slug}.jpg')).convert('RGB')
    w = src.width
    scale = min(1, PX_OUT / w)
    img = src.resize((int(w * scale), int(src.height * scale)), Image.LANCZOS)
    name = f'{kind}-{slug}.jpg'
    img.save(os.path.join(BUILD, 'img', name), quality=86, optimize=True)
    return name


# ---------------- document parts ----------------
sheets = []
toc = []


def sheet(content, cls=''):
    sheets.append(f'<section class="sheet {cls}">{content}<footer class="sheet__foot"><span>#DOUGLASDialogue Hub · Sitemap &amp; Wireframes</span><span class="pg"></span></footer></section>')


# Cover
toc_items = ['Sitemap — structure diagram', 'Sitemap — complete numbered list', 'How to read the screens & wireframes'] + \
    [f"{p['n']} · {p['title']}" for p in pages] + ['Detail views & overlay states']
sheet(f'''
<div class="cover">
  <div class="cover__mint"></div>
  <div class="cover__body">
    <p class="eyebrow">#DOUGLASDIALOGUE HUB</p>
    <h1>Sitemap &amp;<br>Wireframes</h1>
    <p class="cover__lead">Complete, numbered documentation of all 8 pages, their sections, detail views and overlay states — each shown as annotated screenshot and as wireframe.</p>
    <dl class="cover__meta">
      <div><dt>Version</dt><dd>Prototype 1.0 · final design state</dd></div>
      <div><dt>Date</dt><dd>{date.today().strftime('%d.%m.%Y')}</dd></div>
      <div><dt>Viewport</dt><dd>Desktop 1440 px · mobile 390 px · Employee view</dd></div>
      <div><dt>Scope</dt><dd>{len(pages)} pages · {sum(1 for p in pages for i in p['items'] if i['kind']=='section')} page sections · {len(GLOBAL)} global elements · {len(states)} detail views / states</dd></div>
    </dl>
  </div>
  <ol class="cover__toc">{''.join(f'<li>{E(t)}</li>' for t in toc_items)}</ol>
</div>''', 'sheet--cover')

# Sitemap diagram
def page_card(p):
    secs = [i for i in p['items'] if i['kind'] == 'section']
    rows = ''.join(f'<li><b>{i["num"]}</b><span>{E(short(i["name"]))}</span>{"<i>E/M</i>" if i.get("roleDependent") else ""}</li>' for i in secs)
    det = ''.join(f'<li class="det"><b>{s["id"]}</b><span>{E(s["title"].split(" (")[0].replace("Nugget reader: ", "Reader: "))}</span></li>' for s in details.get(p['n'], []))
    return f'''<div class="node">
      <div class="node__head"><span class="node__n">{p["n"]}</span><span class="node__t">{E(p["title"])}</span></div>
      <div class="node__route">{E(p["route"])}</div>
      <ul class="node__list">{rows}{det}</ul></div>'''


groups = [('Dashboard', [p for p in pages if p['group'] == 'Dashboard']),
          ('Dialogue Phases', [p for p in pages if p['group'] == 'Dialogue Phases']),
          ('Resources', [p for p in pages if p['group'] == 'Resources'])]
gl = ''.join(f'<li><b>{n}</b>{E(t)}</li>' for n, t, _, _ in GLOBAL)
sheet(f'''
<header class="sheet__head"><p class="eyebrow">Sitemap</p><h2>Structure diagram</h2></header>
<div class="tree" id="sitemap-diagram">
  <div class="tree__root"><span>#DOUGLASDialogue Hub</span><small>Root · 8 primary routes</small></div>
  <div class="tree__global"><div class="tree__global-h"><b>0</b> Global — on every page</div><ul>{gl}</ul></div>
  <div class="tree__groups">
    {''.join(f'<div class="tree__group" style="flex:{len(ps)}"><div class="tree__group-h">{E(g)}</div><div class="tree__cols">{"".join(page_card(p) for p in ps)}</div></div>' for g, ps in groups)}
  </div>
  <p class="tree__legend"><b>N.x</b> page section (top → bottom) · <b>N.Dx</b> detail view / state · <i>E/M</i> content differs between Employee and Manager view</p>
</div>''', 'sheet--tree')

# Complete numbered list (flows over several printed pages)
rows = ['<tr class="grp"><td colspan="5">0 · Global elements &amp; overlays</td></tr>']
rows += [f'<tr><td class="n">{n}</td><td>{E(t)}</td><td class="r">{E(w)}</td><td>{E(d)}</td><td></td></tr>' for n, t, w, d in GLOBAL]
for p in pages:
    rows.append(f'<tr class="grp"><td colspan="5">{p["n"]} · {E(p["title"])} <span class="r">{E(p["route"])}</span></td></tr>')
    for i in p['items']:
        if i['kind'] != 'section':
            continue
        rows.append(f'<tr><td class="n">{i["num"]}</td><td>{E(i["name"])}</td><td class="r">{E(anchor(p["route"], i["id"]) or p["route"])}</td><td>Page section</td><td>{"E/M" if i.get("roleDependent") else ""}</td></tr>')
    for s in details.get(p['n'], []):
        rows.append(f'<tr class="det"><td class="n">{s["id"]}</td><td>{E(s["title"])}</td><td class="r">{E(s["route"])}</td><td>{E(TRIGGERS.get(s["id"], "Detail view"))}</td><td></td></tr>')
sheets.append(f'''<section class="flow"><header class="sheet__head"><p class="eyebrow">Sitemap</p><h2>Complete numbered list</h2></header>
<table class="list"><thead><tr><th>No.</th><th>Page / area</th><th>Route / anchor</th><th>Type / how to open</th><th>Role</th></tr></thead><tbody>{''.join(rows)}</tbody></table></section>''')

# Reading guide
sheet('''
<header class="sheet__head"><p class="eyebrow">Guide</p><h2>How to read the screens &amp; wireframes</h2></header>
<div class="guide">
  <div><h3>Numbering</h3><ul>
    <li><b>0.x</b> Global elements that appear on every page (service bar, header, footer) and overlays (dropdown, language menu, search, Dialogue Guide, mobile menu).</li>
    <li><b>1 – 8</b> The eight primary pages in navigation order.</li>
    <li><b>N.x</b> Sections of page N, numbered from top to bottom.</li>
    <li><b>N.Dx</b> Detail views and states of page N (drawers, readers, deep links).</li></ul></div>
  <div><h3>Layout of each sheet</h3><ul>
    <li>Left: annotated <b>screenshot</b> of the final design.</li>
    <li>Middle: the same area as <b>wireframe</b> — greyscale, images as crossed placeholders, same numbering.</li>
    <li>Right: <b>legend</b> of all areas of the page; areas visible on the current sheet are highlighted.</li>
    <li>Long pages are split top to bottom into consecutive sheets (“part 1/3” …).</li></ul></div>
  <div><h3>Notes</h3><ul>
    <li>All screens show the <b>Employee</b> view on desktop (1440 px). Sections marked <i>E/M</i> change their content in the Manager view.</li>
    <li>Badges and outlines are documentation overlays, not part of the interface.</li>
    <li>The floating “Dialogue Guide” launcher is hidden on full-page captures and documented separately as 0.8.</li></ul></div>
</div>''')

# Page sheets
def legend(items, y0, y1):
    lis = []
    for i in items:
        inside = i['top'] < y1 and i['top'] + i['height'] > y0
        lis.append(f'<li class="{"on" if inside else ""} {"glob" if i["kind"] == "global" else ""}"><b>{i["num"]}</b><span>{E(short(i["name"]) if i["kind"] == "global" else i["name"])}</span>{"<i>E/M</i>" if i.get("roleDependent") else ""}</li>')
    return '<ol class="legend">' + ''.join(lis) + '</ol>'


def page_sheets(num, title, route, slug, items, note=''):
    a = slices(slug, 'screens')
    b = slices(slug, 'wireframes')
    for k, ((sa, y0, y1), (sb, _, _)) in enumerate(zip(a, b)):
        sheet(f'''
<header class="sheet__head sheet__head--row"><div><p class="eyebrow">{E(str(num))} · {E(route)}</p><h2>{E(title)}</h2></div>
<p class="part">Part {k + 1} / {len(a)}{(' · ' + E(note)) if note else ''}</p></header>
<div class="cmp">
  <figure><figcaption>Screenshot</figcaption><img src="img/{sa}"></figure>
  <figure><figcaption>Wireframe</figcaption><img src="img/{sb}"></figure>
  <aside><p class="eyebrow">Areas on this page</p>{legend(items, y0, y1)}</aside>
</div>''')


for p in pages:
    page_sheets(p['n'], p['title'], p['route'], p['slug'], p['items'])
    for r in [s for s in states if s['page'] == p['n'] and s.get('full')]:
        page_sheets(r['id'], r['title'], r['route'], r['slug'], r['items'], 'Detail view')

# State sheets (two per printed page where possible)
st = [s for s in states if not s.get('full')]
for s in st:
    a, b = single(s['slug'], 'screens'), single(s['slug'], 'wireframes')
    sheet(f'''
<header class="sheet__head sheet__head--row"><div><p class="eyebrow">{E(s["id"])} · {"Global overlay" if s["page"] == 0 else "Detail view of page " + str(s["page"])}</p><h2>{E(s["title"])}</h2></div>
<p class="part">Route {E(s["route"])}<br>Open: {E(TRIGGERS.get(s["id"], ""))}</p></header>
<div class="cmp cmp--state {"cmp--mobile" if s.get("mobile") else ""}">
  <figure><figcaption>Screenshot</figcaption><img src="img/{a}"></figure>
  <figure><figcaption>Wireframe</figcaption><img src="img/{b}"></figure>
</div>''')

CSS = open(os.path.join(os.path.dirname(__file__), 'sitemap-doc.css')).read()
FONT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2'))
if os.path.exists(FONT):
    import shutil
    shutil.copy(FONT, os.path.join(BUILD, 'nunito.woff2'))
    CSS = "@font-face{font-family:'Nunito Sans';src:url(nunito.woff2) format('woff2');font-weight:200 1000;}" + CSS
doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>#DOUGLASDialogue Hub — Sitemap &amp; Wireframes</title>
<style>{CSS}</style></head><body>{''.join(sheets)}</body></html>'''
open(os.path.join(BUILD, 'index.html'), 'w').write(doc)
print('sheets', len(sheets))
