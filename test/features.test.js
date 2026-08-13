const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

test('manifest declares keyboard commands and scheduled backup permission', () => {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  assert.ok(manifest.permissions.includes('alarms'));
  assert.ok(manifest.commands['save-current-tabs']);
  assert.ok(manifest.commands['open-library']);
});

test('options expose theme, backups, shortcuts, and organization statistics', () => {
  const html = fs.readFileSync('options.html', 'utf8');
  ['theme', 'backup-enabled', 'backup-frequency', 'open-shortcuts', 'stats'].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
});
