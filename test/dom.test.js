const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

test('every element used by the popup controller exists in the HTML', () => {
  const html = fs.readFileSync('saveTabs.html', 'utf8');
  const source = fs.readFileSync('popup.js', 'utf8');
  const definition = source.slice(source.indexOf('const ELEMENT_IDS'), source.indexOf('const EXTRA_COPY'));
  const expectedIds = [...definition.matchAll(/\b\w+: '([\w-]+)'/g)].map(([, id]) => id);
  const ids = new Set([...html.matchAll(/\bid="([\w-]+)"/g)].map(([, id]) => id));
  const missing = expectedIds.filter(id => !ids.has(id));
  assert.deepEqual(missing, []);
});
