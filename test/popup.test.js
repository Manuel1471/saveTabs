const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

function loadPopup() {
  const source = fs.readFileSync('popup.js', 'utf8')
    .replace("document.addEventListener('DOMContentLoaded', () => new TabManager().init());", 'globalThis.TabManager = TabManager; globalThis.COPY = COPY;')
    .replace("const STORAGE_KEY = 'tabSessions';", "globalThis.STORAGE_KEY = 'tabSessions'; const STORAGE_KEY = 'tabSessions';");
  let downloaded = false;
  const document = { addEventListener() {}, createElement() { return { style: {}, click() { downloaded = true; }, remove() {} }; }, body: { append() {} } };
  const context = { console, crypto: webcrypto, structuredClone, URL, Blob, setTimeout(callback) { callback(); return 1; }, clearTimeout, document, chrome: {} };
  vm.runInNewContext(source, context);
  context.wasDownloaded = () => downloaded;
  return context;
}

function manager(TabManager, sessions = []) {
  const instance = Object.create(TabManager.prototype);
  instance.sessions = sessions;
  instance.currentSessionId = sessions[0]?.id || '';
  instance.selectedIds = new Set();
  instance.language = 'en';
  instance.settings = {};
  instance.rules = [];
  instance.history = [];
  instance.elements = { searchTabs: { value: '' }, tagFilter: { value: '' }, sortTabs: { value: 'manual' } };
  return instance;
}

test('normalises legacy tabs into the v1.2.1 schema', () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager);
  const tab = instance.normaliseTab({ url: 'https://example.com', title: 'Example' });
  assert.equal(tab.url, 'https://example.com');
  assert.deepEqual(Array.from(tab.tags), []);
  assert.equal(tab.pinned, false);
  assert.equal(tab.note, '');
  assert.ok(tab.id);
  assert.ok(tab.savedAt);
});

test('the popup controller declares explicit element IDs', () => {
  const source = fs.readFileSync('popup.js', 'utf8');
  assert.match(source, /list: 'tab-list', count: 'tab-count', selectionCount: 'selection-count'/);
});

test('rejects invalid sessions and invalid tabs during migration', () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager);
  const sessions = instance.normaliseSessions([{ name: 'Valid', tabs: [{ url: 'https://example.com' }, {}] }, { name: 12, tabs: [] }]);
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].tabs.length, 1);
});

test('manual sorting preserves the persisted drag-and-drop order', () => {
  const { TabManager } = loadPopup();
  const session = { id: 'one', name: 'One', tabs: [{ id: 'first', url: 'https://a.test', title: 'Z', tags: [], savedAt: 1 }, { id: 'second', url: 'https://b.test', title: 'A', tags: [], savedAt: 2 }] };
  const instance = manager(TabManager, [session]);
  assert.deepEqual(Array.from(instance.visibleTabs(), tab => tab.id), ['first', 'second']);
});

test('search, tag filtering, and title sorting return the expected tabs', () => {
  const { TabManager } = loadPopup();
  const session = { id: 'one', name: 'One', tabs: [{ id: 'a', url: 'https://z.test', title: 'Zebra', tags: ['work'], savedAt: 1 }, { id: 'b', url: 'https://a.test', title: 'Alpha', tags: ['read'], savedAt: 2 }] };
  const instance = manager(TabManager, [session]);
  instance.elements.searchTabs.value = 'alpha';
  assert.deepEqual(Array.from(instance.visibleTabs(), tab => tab.id), ['b']);
  instance.elements.searchTabs.value = '';
  instance.elements.tagFilter.value = 'work';
  assert.deepEqual(Array.from(instance.visibleTabs(), tab => tab.id), ['a']);
  instance.elements.tagFilter.value = '';
  instance.elements.sortTabs.value = 'title';
  assert.deepEqual(Array.from(instance.visibleTabs(), tab => tab.id), ['b', 'a']);
});

test('detects duplicate URLs across sessions', () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager, [{ id: 'one', tabs: [{ id: 'a', url: 'https://same.test' }] }, { id: 'two', tabs: [{ id: 'b', url: 'https://same.test' }] }]);
  assert.equal(instance.duplicateCount('https://same.test'), 1);
});

test('translation interpolation and English strings are available', () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager);
  assert.equal(instance.t('open'), 'Open');
  assert.equal(instance.t('selectTab', { name: 'Example' }), 'Select Example');
});

test('language toggle persists the setting and re-renders the interface', async () => {
  const context = loadPopup();
  const instance = manager(context.TabManager);
  let stored;
  context.chrome.storage = { local: { set: async value => { stored = value; } } };
  instance.elements.languageToggle = { textContent: '', setAttribute() {}, title: '' };
  instance.applyTranslations = () => {};
  instance.render = () => {};
  await instance.toggleLanguage();
  assert.equal(instance.language, 'es');
  assert.equal(stored.saveTabsSettings.language, 'es');
});

test('the default session name follows the selected language', () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager);
  instance.language = 'en';
  assert.equal(instance.displaySessionName({ name: 'Mis pestañas' }), 'My tabs');
  instance.language = 'es';
  assert.equal(instance.displaySessionName({ name: 'My tabs' }), 'Mis pestañas');
});

test('saves current-window tabs, skips duplicates, and records a history snapshot', async () => {
  const context = loadPopup();
  const session = { id: 'one', name: 'One', tabs: [{ id: 'existing', url: 'https://existing.test', title: 'Existing', tags: [] }] };
  const instance = manager(context.TabManager, [session]);
  let persisted = false;
  let message = '';
  let queryOptions;
  context.chrome.tabs = { query: async options => { queryOptions = options; return [{ url: 'https://existing.test', title: 'Existing' }, { url: 'https://new.test', title: 'New tab' }]; } };
  instance.persist = async () => { persisted = true; };
  instance.render = () => {};
  instance.showNotification = value => { message = value; };
  await instance.saveTabs();
  assert.equal(instance.currentSession.tabs.length, 2);
  assert.equal(queryOptions.lastFocusedWindow, true);
  assert.equal(instance.history.length, 1);
  assert.equal(persisted, true);
  assert.match(message, /tab saved/);
});

test('adds automatic saving rules to the current session', async () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager, [{ id: 'one', name: 'One', tabs: [] }]);
  instance.openTextDialog = async () => 'example.com, docs.example.com';
  instance.persist = async () => {};
  instance.showNotification = () => {};
  await instance.addRule();
  assert.equal(instance.rules.length, 1);
  assert.deepEqual(Array.from(instance.rules[0].domains), ['example.com', 'docs.example.com']);
  assert.equal(instance.rules[0].sessionId, 'one');
});

test('snapshots can preserve a restorable library history', () => {
  const { TabManager } = loadPopup();
  const instance = manager(TabManager, [{ id: 'one', name: 'One', tabs: [] }]);
  instance.snapshot();
  instance.sessions[0].name = 'Changed';
  assert.equal(instance.history.length, 1);
  assert.equal(instance.history[0].sessions[0].name, 'One');
});

test('exports a JSON backup through a temporary download link', () => {
  const context = loadPopup();
  const instance = manager(context.TabManager, [{ id: 'one', name: 'One', tabs: [] }]);
  instance.showNotification = () => {};
  instance.exportTabs();
  assert.equal(context.wasDownloaded(), true);
});
