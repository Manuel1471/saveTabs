const SESSIONS_KEY = 'tabSessions';
const SETTINGS_KEY = 'saveTabsSettings';
const RULES_KEY = 'autoSaveRules';
const BACKUPS_KEY = 'scheduledBackups';
const BACKUP_ALARM = 'save-tabs-scheduled-backup';
const extensionApi = globalThis.browser?.tabs && globalThis.browser?.storage ? globalThis.browser : globalThis.chrome;

extensionApi.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const data = await extensionApi.storage.local.get([SESSIONS_KEY, RULES_KEY, SETTINGS_KEY]);
  const rule = (data[RULES_KEY] || []).find(item => item.enabled && (item.domains || []).some(domain => matchesDomain(tab.url, domain)));
  if (!rule) return;
  const sessions = data[SESSIONS_KEY] || [];
  const session = sessions.find(item => item.id === rule.sessionId);
  if (!session || session.tabs.some(item => item.url === tab.url)) return;
  session.tabs.push({ id: crypto.randomUUID(), url: tab.url, title: tab.title || tab.url, tags: ['auto'], note: '', pinned: false, savedAt: Date.now(), autoSavedBy: rule.id });
  await extensionApi.storage.local.set({ [SESSIONS_KEY]: sessions });
  if (data[SETTINGS_KEY]?.syncEnabled) await extensionApi.storage.sync.set({ [SESSIONS_KEY]: sessions });
});

extensionApi.commands?.onCommand.addListener(async command => {
  if (command === 'open-library') return extensionApi.tabs.create({ url: extensionApi.runtime.getURL('saveTabs.html?expanded=1') });
  if (command !== 'save-current-tabs') return;
  const data = await extensionApi.storage.local.get(SESSIONS_KEY);
  const sessions = data[SESSIONS_KEY] || [];
  if (!sessions.length) return;
  const tabs = (await extensionApi.tabs.query({ currentWindow: true })).filter(tab => tab.url);
  const urls = new Set(sessions[0].tabs.map(tab => tab.url));
  sessions[0].tabs.push(...tabs.filter(tab => !urls.has(tab.url)).map(tab => ({ id: crypto.randomUUID(), url: tab.url, title: tab.title || tab.url, tags: [], note: '', pinned: false, savedAt: Date.now() })));
  await extensionApi.storage.local.set({ [SESSIONS_KEY]: sessions });
});

extensionApi.alarms?.onAlarm.addListener(async alarm => {
  if (alarm.name !== BACKUP_ALARM) return;
  const data = await extensionApi.storage.local.get([SESSIONS_KEY, BACKUPS_KEY]);
  const backups = Array.isArray(data[BACKUPS_KEY]) ? data[BACKUPS_KEY] : [];
  backups.unshift({ at: Date.now(), sessions: structuredClone(data[SESSIONS_KEY] || []) });
  await extensionApi.storage.local.set({ [BACKUPS_KEY]: backups.slice(0, 10) });
});

function matchesDomain(url, domain) {
  try { const host = new URL(url).hostname.toLowerCase(); const value = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; return host === value || host.endsWith(`.${value}`); } catch { return false; }
}
