const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

function loadBackground() {
  let listener; let commandListener; let alarmListener;
  const source = `${fs.readFileSync('background.js', 'utf8')}\nglobalThis.matchesDomain = matchesDomain;`;
  const chrome = { tabs: { onUpdated: { addListener(callback) { listener = callback; } }, create: async () => {}, query: async () => [] }, commands: { onCommand: { addListener(callback) { commandListener = callback; } } }, alarms: { onAlarm: { addListener(callback) { alarmListener = callback; } } }, storage: { local: { get: async () => ({}), set: async () => {} }, sync: { set: async () => {} } }, runtime: { getURL: path => path } };
  const context = { chrome, crypto: webcrypto, URL, structuredClone };
  vm.runInNewContext(source, context);
  return { ...context, listener, commandListener, alarmListener, chrome };
}

test('matches exact domains and subdomains without matching unrelated hosts', () => {
  const { matchesDomain } = loadBackground();
  assert.equal(matchesDomain('https://docs.example.com/page', 'example.com'), true);
  assert.equal(matchesDomain('https://example.com', 'example.com'), true);
  assert.equal(matchesDomain('https://notexample.com', 'example.com'), false);
  assert.equal(matchesDomain('not a url', 'example.com'), false);
});

test('scheduled backup keeps the ten most recent private snapshots', async () => {
  const { alarmListener, chrome } = loadBackground();
  let stored;
  chrome.storage.local.get = async () => ({ tabSessions: [{ id: 'one', tabs: [] }], scheduledBackups: Array.from({ length: 10 }, (_, index) => ({ at: index, sessions: [] })) });
  chrome.storage.local.set = async value => { stored = value; };
  await alarmListener({ name: 'save-tabs-scheduled-backup' });
  assert.equal(stored.scheduledBackups.length, 10);
  assert.equal(stored.scheduledBackups[0].sessions[0].id, 'one');
});

test('keyboard shortcut opens the expanded library', async () => {
  const { commandListener, chrome } = loadBackground();
  let created;
  chrome.tabs.create = async value => { created = value; };
  await commandListener('open-library');
  assert.equal(created.url, 'saveTabs.html?expanded=1');
});

test('auto-save rule stores a new matching tab once', async () => {
  const { listener, chrome } = loadBackground();
  const sessions = [{ id: 'work', tabs: [] }];
  let persisted;
  chrome.storage.local.get = async () => ({ tabSessions: sessions, autoSaveRules: [{ id: 'rule', sessionId: 'work', enabled: true, domains: ['example.com'] }], saveTabsSettings: {} });
  chrome.storage.local.set = async value => { persisted = value; };
  await listener(1, { status: 'complete' }, { url: 'https://docs.example.com/guide', title: 'Guide' });
  assert.equal(persisted.tabSessions[0].tabs.length, 1);
  await listener(1, { status: 'complete' }, { url: 'https://docs.example.com/guide', title: 'Guide' });
  assert.equal(persisted.tabSessions[0].tabs.length, 1);
});
