from pathlib import Path
import re,json,subprocess,os,sys
root=Path('/mnt/data/mp_regression4')
report=[]
errors=[]
# files
htmls=list(root.rglob('*.html'))
css=list(root.rglob('*.css'))
js=list(root.rglob('*.js'))
jsons=list(root.rglob('*.json'))
report.append(f'HTML files: {len(htmls)}')
report.append(f'CSS files: {len(css)}')
report.append(f'JS files: {len(js)}')
report.append(f'JSON files: {len(jsons)}')
# link check href/src local css js assets-ish
def normbase(html, val):
    val=val.split('#')[0].split('?')[0].strip()
    if not val or val.startswith(('http://','https://','mailto:','tel:','javascript:','data:')): return None
    if val.startswith('/'):
        return root/val.lstrip('/')
    return (html.parent/val).resolve()
missing=[]
pattern=re.compile(r'(?:href|src)=["\']([^"\']+)["\']')
for h in htmls:
    txt=h.read_text(errors='ignore')
    for v in pattern.findall(txt):
        if v.startswith('#'): continue
        p=normbase(h,v)
        if p is None: continue
        # page dirs: allow trailing slash -> index.html
        if v.endswith('/') or (p.exists() and p.is_dir()):
            p=p/'index.html'
        # only check likely local files/pages
        ext=Path(v.split('#')[0].split('?')[0]).suffix.lower()
        if ext or v.endswith('/') or v.startswith('../') or v.startswith('./') or '/' in v:
            if not p.exists():
                missing.append((str(h.relative_to(root)),v,str(p.relative_to(root)) if str(p).startswith(str(root)) else str(p)))
# json check
json_err=[]
for f in jsons:
    try: json.loads(f.read_text())
    except Exception as e: json_err.append((str(f.relative_to(root)),str(e)))
# css braces simple ignoring comments strings roughly
css_err=[]
for f in css:
    txt=re.sub(r'/\*.*?\*/','',f.read_text(errors='ignore'),flags=re.S)
    bal=0; minbal=0
    for ch in txt:
        if ch=='{': bal+=1
        elif ch=='}': bal-=1; minbal=min(minbal,bal)
    if bal!=0 or minbal<0: css_err.append((str(f.relative_to(root)),bal,minbal))
# js syntax node --check
js_err=[]
for f in js:
    res=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    if res.returncode!=0: js_err.append((str(f.relative_to(root)),res.stderr[:500]))
# topbar consistency: gather nav text snippets and saved header css/js presence
nav_pages=['index.html','mobiel/index.html','sim-only/index.html','internet-tv/index.html','streaming/index.html','providers/index.html','kies-je-meepakker/index.html','opgeslagen/index.html','uitleg/index.html','contact/index.html','privacy/index.html','voorwaarden/index.html']
nav_findings=[]
for rel in nav_pages:
    f=root/rel
    if not f.exists():
        nav_findings.append((rel,'MISSING PAGE'))
        continue
    txt=f.read_text(errors='ignore')
    has_uitleg_nav=bool(re.search(r'<nav[^>]*class=["\'][^"\']*(?:topbar|desktop|nav)[^"\']*["\'][\s\S]{0,2500}MeerPakkers Uitleg',txt,re.I))
    has_saved_css='saved-deals-header-v50.css' in txt
    has_saved_js='saved-deals-header-v50.js' in txt
    has_header_css='topbar-final-lock-v17.css' in txt or 'header.css' in txt
    nav_findings.append((rel, f'uitleg_in_nav={has_uitleg_nav}, savedCss={has_saved_css}, savedJs={has_saved_js}, headerCss={has_header_css}'))
# active references to deleted legacy js names
legacy=['data.js','deals.js','filters.js','home-cta-order-fix-v24.js','home-load-more-v20.js','home-search-filter-v26.js','meepakker-search-v1.js','providers.js','router.js','storage.js']
legacy_refs=[]
for f in htmls+js:
    txt=f.read_text(errors='ignore')
    for name in legacy:
        if re.search(r'(?<![\w-])'+re.escape(name)+r'(?![\w-])',txt):
            legacy_refs.append((str(f.relative_to(root)),name))
# sitemap pages exists
sitemap=root/'sitemap.xml'
sitemap_missing=[]
if sitemap.exists():
    txt=sitemap.read_text(errors='ignore')
    locs=re.findall(r'<loc>(.*?)</loc>',txt)
    for loc in locs:
        # map domain path
        m=re.match(r'https?://[^/]+/(.*)$',loc)
        if m:
            path=m.group(1).strip('/')
            target=root/(path or 'index.html')
            if target.is_dir(): target=target/'index.html'
            elif not target.suffix: target=target/'index.html'
            if not target.exists(): sitemap_missing.append((loc,str(target.relative_to(root))))
# TODO/conflict
markers=[]
for f in htmls+css+js+jsons:
    txt=f.read_text(errors='ignore')
    for mark in ['<<<<<<<','>>>>>>>','======','debugger','console.log','TODO','FIXME']:
        if mark in txt:
            markers.append((str(f.relative_to(root)),mark))
            break

print('MISSING',len(missing))
for x in missing[:50]: print('missing',x)
print('JSON_ERR',len(json_err),json_err[:10])
print('CSS_ERR',len(css_err),css_err[:20])
print('JS_ERR',len(js_err),js_err[:10])
print('LEGACY_REFS',len(legacy_refs),legacy_refs[:20])
print('SITEMAP_MISSING',len(sitemap_missing),sitemap_missing[:20])
print('MARKERS',len(markers),markers[:30])
print('NAV_FINDINGS')
for x in nav_findings: print(x)
