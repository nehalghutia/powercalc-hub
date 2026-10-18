import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { tools } from '../src/lib/data.ts';

const slugs = tools.map(([slug]) => slug);
assert.equal(slugs.length, 10, 'Expected ten calculators');
assert.equal(new Set(slugs).size, 10, 'Calculator routes must be unique');
const builtSlugs = (
  await readdir(new URL('../dist/calculators/', import.meta.url), { withFileTypes: true })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(builtSlugs, [...slugs].sort(), 'Built calculator routes must match definitions');
const paths = ['', 'about', 'privacy', ...slugs.map((slug) => 'calculators/' + slug)];
for (const path of paths) {
  const html = await readFile(
    new URL('../dist/' + (path ? path + '/' : '') + 'index.html', import.meta.url),
    'utf8',
  );
  assert.match(html, /<h1[ >]/, path + ': missing heading');
  assert.match(html, /<link[^>]*rel="canonical"/, path + ': missing canonical');
  if (path.startsWith('calculators/')) {
    assert.match(html, /<form[ >]/, path + ': missing calculator form');
    assert.match(html, /<script[^>]*type="module"[^>]*src=/, path + ': missing compiled module');
    assert.ok(!html.includes('querySelector<HTMLFormElement>'), path + ': uncompiled TypeScript');
  }
}
const locations = (xml) =>
  [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));
const index = await readFile(new URL('../dist/sitemap-index.xml', import.meta.url), 'utf8');
const sitemapFiles = locations(index);
assert.ok(sitemapFiles.length, 'Sitemap index is empty');
const sitemapPaths = new Set();
for (const file of sitemapFiles) {
  assert.match(file.pathname, /^\/sitemap[^/]*\.xml$/, 'Unexpected sitemap path');
  const xml = await readFile(new URL('../dist' + file.pathname, import.meta.url), 'utf8');
  for (const location of locations(xml)) sitemapPaths.add(location.pathname.replace(/\/$/, ''));
}
for (const path of paths)
  assert.ok(sitemapPaths.has(path ? '/' + path : ''), path + ': missing sitemap entry');
console.log('Verified 13 static pages, all 10 calculator modules, and sitemap entries.');
