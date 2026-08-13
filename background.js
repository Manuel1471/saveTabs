const SESSIONS_KEY = 'tabSessions';
const SETTINGS_KEY = 'saveTabsSettings';
const RULES_KEY = 'autoSaveRules';

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const data = await chrome.storage.local.get([SESSIONS_KEY, RULES_KEY, SETTINGS_KEY]);
  const rule = (data[RULES_KEY] || []).find(item => item.enabled && (item.domains || []).some(domain => matchesDomain(tab.url, domain)));
  if (!rule) return;
  const sessions = data[SESSIONS_KEY] || [];
  const session = sessions.find(item => item.id === rule.sessionId);
  if (!session || session.tabs.some(item => item.url === tab.url)) return;
  session.tabs.push({ id: crypto.randomUUID(), url: tab.url, title: tab.title || tab.url, tags: ['auto'], note: '', pinned: false, savedAt: Date.now(), autoSavedBy: rule.id });
  await chrome.storage.local.set({ [SESSIONS_KEY]: sessions });
  if (data[SETTINGS_KEY]?.syncEnabled) await chrome.storage.sync.set({ [SESSIONS_KEY]: sessions });
});

function matchesDomain(url, domain) {
  try { const host = new URL(url).hostname.toLowerCase(); const value = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; return host === value || host.endsWith(`.${value}`); } catch { return false; }
}
