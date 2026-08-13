const STORAGE_KEY = 'tabSessions';
const LEGACY_STORAGE_KEY = 'savedTabs';
const SETTINGS_KEY = 'saveTabsSettings';
const RULES_KEY = 'autoSaveRules';
const HISTORY_KEY = 'saveTabsHistory';
const COPY = {
  es: { library: 'BIBLIOTECA DE PESTAÑAS', newSession: 'Crear sesión', renameSession: 'Renombrar sesión', deleteSession: 'Eliminar sesión', currentSession: 'Sesión actual', sortTabs: 'Ordenar pestañas', searchPlaceholder: 'Buscar título, URL o etiqueta', searchTabs: 'Buscar pestañas guardadas', clearSearch: 'Limpiar búsqueda', filterTag: 'Filtrar por etiqueta', allTags: 'Todas', newest: 'Recientes', oldest: 'Antiguas', manual: 'Manual', titleSort: 'Título A–Z', domainSort: 'Dominio A–Z', selectVisible: 'Seleccionar visibles', saveCurrent: 'Guardar pestañas actuales', open: 'Abrir', pin: 'Fijar', note: 'Nota', tag: 'Etiquetar', delete: 'Eliminar', export: 'Exportar', import: 'Importar', rules: 'Reglas', checkLinks: 'Comprobar enlaces', history: 'Historial', enableSync: 'Activar sincronización', undoDelete: 'Deshacer eliminación', close: 'Cerrar', cancel: 'Cancelar', defaultSession: 'Mis pestañas', noSelection: 'Sin selección', selectedOne: 'seleccionada', selectedMany: 'seleccionadas', savedOne: 'guardada', savedMany: 'guardadas', alreadySaved: 'Las pestañas de esta ventana ya están guardadas.', tabSaved: 'pestaña guardada', tabsSaved: 'pestañas guardadas', sessionCreated: 'Sesión creada.', sessionUpdated: 'Nombre actualizado.', keepSession: 'Conserva al menos una sesión.', deleteSessionConfirm: '¿Eliminar “{name}” y todas sus pestañas?', sessionDeleted: 'Sesión eliminada.', tabOpened: 'pestaña abierta', tabsOpened: 'pestañas abiertas', tagsAdded: 'Etiquetas agregadas.', tabDeleted: 'pestaña eliminada', tabsDeleted: 'pestañas eliminadas', deletionUndone: 'Eliminación deshecha.', tagDeleted: 'Etiqueta eliminada.', backupDownloaded: 'Respaldo descargado.', sessionImported: 'sesión importada', sessionsImported: 'sesiones importadas', badBackup: 'Ese archivo no es un respaldo válido de Save Tabs.', selectTab: 'Seleccionar {name}', openTab: 'Abrir {name}', removeTag: 'Eliminar etiqueta {tag}', noResults: 'Sin resultados', noResultsText: 'Prueba otra búsqueda o elimina los filtros activos.', emptySession: 'Tu sesión está vacía', emptySessionText: 'Guarda las pestañas de la ventana actual para encontrarlas aquí después.', newSessionTitle: 'Nueva sesión', renameSessionTitle: 'Renombrar sesión', sessionName: 'Nombre de la sesión', newSessionPlaceholder: 'Ej. Investigación de UX', create: 'Crear', save: 'Guardar', tagTitle: 'Etiquetar pestañas', tags: 'Etiquetas', tagsPlaceholder: 'trabajo, leer después', tagsHelp: 'Separa varias etiquetas con comas.', add: 'Agregar' },
  en: { library: 'TAB LIBRARY', newSession: 'Create session', renameSession: 'Rename session', deleteSession: 'Delete session', currentSession: 'Current session', sortTabs: 'Sort tabs', searchPlaceholder: 'Search title, URL, or tag', searchTabs: 'Search saved tabs', clearSearch: 'Clear search', filterTag: 'Filter by tag', allTags: 'All', newest: 'Newest', oldest: 'Oldest', manual: 'Manual', titleSort: 'Title A–Z', domainSort: 'Domain A–Z', selectVisible: 'Select visible', saveCurrent: 'Save current tabs', open: 'Open', pin: 'Pin', note: 'Note', tag: 'Tag', delete: 'Delete', export: 'Export', import: 'Import', rules: 'Rules', checkLinks: 'Check links', history: 'History', enableSync: 'Enable sync', undoDelete: 'Undo deletion', close: 'Close', cancel: 'Cancel', defaultSession: 'My tabs', noSelection: 'No selection', selectedOne: 'selected', selectedMany: 'selected', savedOne: 'saved', savedMany: 'saved', alreadySaved: 'All tabs in this window are already saved.', tabSaved: 'tab saved', tabsSaved: 'tabs saved', sessionCreated: 'Session created.', sessionUpdated: 'Name updated.', keepSession: 'Keep at least one session.', deleteSessionConfirm: 'Delete “{name}” and all its saved tabs?', sessionDeleted: 'Session deleted.', tabOpened: 'tab opened', tabsOpened: 'tabs opened', tagsAdded: 'Tags added.', tabDeleted: 'tab deleted', tabsDeleted: 'tabs deleted', deletionUndone: 'Deletion undone.', tagDeleted: 'Tag removed.', backupDownloaded: 'Backup downloaded.', sessionImported: 'session imported', sessionsImported: 'sessions imported', badBackup: 'That file is not a valid Save Tabs backup.', selectTab: 'Select {name}', openTab: 'Open {name}', removeTag: 'Remove tag {tag}', noResults: 'No results', noResultsText: 'Try another search or clear the active filters.', emptySession: 'Your session is empty', emptySessionText: 'Save tabs from the current window to find them here later.', newSessionTitle: 'New session', renameSessionTitle: 'Rename session', sessionName: 'Session name', newSessionPlaceholder: 'E.g. UX research', create: 'Create', save: 'Save', tagTitle: 'Tag tabs', tags: 'Tags', tagsPlaceholder: 'work, read later', tagsHelp: 'Separate multiple tags with commas.', add: 'Add' }
};

class TabManager {
  constructor() {
    this.sessions = [];
    this.currentSessionId = '';
    this.selectedIds = new Set();
    this.deletedTabs = null;
    this.toastTimer = null;
    this.language = 'es';
    this.rules = []; this.history = [];
    this.elements = Object.fromEntries(['list', 'count', 'selectionCount', 'selectAll', 'sessionList', 'newSession', 'renameSession', 'deleteSession', 'searchTabs', 'clearSearch', 'tagFilter', 'sortTabs', 'openSelected', 'pinSelected', 'tagSelected', 'noteSelected', 'deleteSelected', 'saveTabs', 'exportTabs', 'importTabs', 'rules', 'checkLinks', 'history', 'syncToggle', 'undoDelete', 'toast', 'textDialog', 'dialogTitle', 'dialogLabel', 'dialogInput', 'dialogHelp', 'dialogSubmit', 'historyDialog', 'historyList'].map(id => [id, document.querySelector(`#${id.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`)]));
  }

  async init() {
    const data = await chrome.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY, SETTINGS_KEY, RULES_KEY, HISTORY_KEY]);
    this.language = data[SETTINGS_KEY]?.language === 'en' ? 'en' : 'es';
    this.settings = data[SETTINGS_KEY] || {};
    this.rules = Array.isArray(data[RULES_KEY]) ? data[RULES_KEY] : [];
    this.history = Array.isArray(data[HISTORY_KEY]) ? data[HISTORY_KEY] : [];
    this.applyTranslations();
    const remote = this.settings.syncEnabled ? await chrome.storage.sync.get(STORAGE_KEY) : {};
    this.sessions = this.normaliseSessions(remote[STORAGE_KEY] || data[STORAGE_KEY]);
    if (!this.sessions.length && Array.isArray(data[LEGACY_STORAGE_KEY]) && data[LEGACY_STORAGE_KEY].length) {
      this.sessions = [this.createSession(this.t('defaultSession'), data[LEGACY_STORAGE_KEY])];
      await this.persist();
    }
    if (!this.sessions.length) this.sessions = [this.createSession(this.t('defaultSession'))];
    this.currentSessionId = this.sessions[0].id;
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.elements.saveTabs.addEventListener('click', () => this.saveTabs());
    this.elements.openSelected.addEventListener('click', () => this.openSelected());
    this.elements.pinSelected.addEventListener('click', () => this.togglePins());
    this.elements.tagSelected.addEventListener('click', () => this.tagSelected());
    this.elements.noteSelected.addEventListener('click', () => this.noteSelected());
    this.elements.deleteSelected.addEventListener('click', () => this.deleteSelected());
    this.elements.undoDelete.addEventListener('click', () => this.undoDelete());
    this.elements.newSession.addEventListener('click', () => this.newSession());
    this.elements.renameSession.addEventListener('click', () => this.renameSession());
    this.elements.deleteSession.addEventListener('click', () => this.deleteSession());
    this.elements.selectAll.addEventListener('change', ({ target }) => { this.visibleTabs().forEach(tab => target.checked ? this.selectedIds.add(tab.id) : this.selectedIds.delete(tab.id)); this.render(); });
    [this.elements.searchTabs, this.elements.tagFilter, this.elements.sortTabs].forEach(element => element.addEventListener('input', () => this.render()));
    this.elements.clearSearch.addEventListener('click', () => { this.elements.searchTabs.value = ''; this.render(); this.elements.searchTabs.focus(); });
    this.elements.importTabs.addEventListener('change', event => this.importTabs(event));
    this.elements.exportTabs.addEventListener('click', () => this.exportTabs());
    this.elements.rules.addEventListener('click', () => this.addRule());
    this.elements.checkLinks.addEventListener('click', () => this.checkLinks());
    this.elements.history.addEventListener('click', () => this.openHistory());
    document.querySelector('[data-close-history]').addEventListener('click', () => this.elements.historyDialog.close());
    this.elements.syncToggle.addEventListener('click', () => this.toggleSync());
    this.elements.languageSelect.addEventListener('change', async ({ target }) => { this.language = target.value; await chrome.storage.local.set({ [SETTINGS_KEY]: { language: this.language } }); this.applyTranslations(); this.render(); });
    document.addEventListener('keydown', event => {
      if (this.elements.textDialog.open) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); this.elements.searchTabs.focus(); }
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); this.saveTabs(); }
    });
  }

  get currentSession() { return this.sessions.find(session => session.id === this.currentSessionId); }
  t(key, values = {}) { return COPY[this.language][key].replace(/\{(\w+)\}/g, (_, name) => values[name] ?? ''); }
  applyTranslations() {
    this.elements.languageSelect.value = this.language;
    document.documentElement.lang = this.language;
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = this.t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = this.t(element.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', this.t(element.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-title]').forEach(element => { element.title = this.t(element.dataset.i18nTitle); });
  }
  createSession(name, tabs = []) { return { id: crypto.randomUUID(), name, tabs: tabs.map(tab => this.normaliseTab(tab)) }; }
  normaliseTab(tab) { return { id: tab.id || crypto.randomUUID(), url: tab.url, title: tab.title || tab.url, tags: Array.isArray(tab.tags) ? tab.tags : [], note: tab.note || '', pinned: Boolean(tab.pinned), linkStatus: tab.linkStatus || '', savedAt: tab.savedAt || Date.now() }; }
  normaliseSessions(value) { return Array.isArray(value) ? value.filter(session => session && typeof session.name === 'string' && Array.isArray(session.tabs)).map(session => ({ ...session, id: session.id || crypto.randomUUID(), tabs: session.tabs.filter(tab => tab?.url).map(tab => this.normaliseTab(tab)) })) : []; }
  async persist() { await chrome.storage.local.set({ [STORAGE_KEY]: this.sessions, [RULES_KEY]: this.rules, [HISTORY_KEY]: this.history }); if (this.settings.syncEnabled) await chrome.storage.sync.set({ [STORAGE_KEY]: this.sessions }); }
  snapshot() { this.history.unshift({ at: Date.now(), sessionId: this.currentSessionId, sessions: structuredClone(this.sessions) }); this.history = this.history.slice(0, 15); }

  async saveTabs() {
    const currentTabs = await chrome.tabs.query({ currentWindow: true });
    const existingUrls = new Set(this.currentSession.tabs.map(tab => tab.url));
    const additions = currentTabs.filter(tab => tab.url && !existingUrls.has(tab.url)).map(tab => this.normaliseTab(tab));
    if (!additions.length) return this.showNotification(this.t('alreadySaved'));
    this.snapshot(); this.currentSession.tabs.push(...additions);
    await this.persist(); this.render(); this.showNotification(`${additions.length} ${this.t(additions.length === 1 ? 'tabSaved' : 'tabsSaved')}.`);
  }

  async newSession() {
    const name = await this.openTextDialog({ title: this.t('newSessionTitle'), label: this.t('sessionName'), placeholder: this.t('newSessionPlaceholder'), submit: this.t('create') });
    if (!name) return;
    this.snapshot(); const session = this.createSession(name); this.sessions.push(session); this.currentSessionId = session.id;
    await this.persist(); this.selectedIds.clear(); this.render(); this.showNotification(this.t('sessionCreated'));
  }

  async renameSession() {
    const name = await this.openTextDialog({ title: this.t('renameSessionTitle'), label: this.t('sessionName'), value: this.currentSession.name, submit: this.t('save') });
    if (!name || name === this.currentSession.name) return;
    this.snapshot(); this.currentSession.name = name; await this.persist(); this.render(); this.showNotification(this.t('sessionUpdated'));
  }

  async deleteSession() {
    if (this.sessions.length === 1) return this.showNotification(this.t('keepSession'));
    if (!confirm(this.t('deleteSessionConfirm', { name: this.currentSession.name }))) return;
    this.snapshot(); this.sessions = this.sessions.filter(session => session.id !== this.currentSessionId); this.currentSessionId = this.sessions[0].id;
    await this.persist(); this.selectedIds.clear(); this.render(); this.showNotification(this.t('sessionDeleted'));
  }

  async openSelected() { const tabs = this.selectedTabs(); if (!tabs.length) return; await Promise.all(tabs.map(tab => chrome.tabs.create({ url: tab.url }))); this.showNotification(`${tabs.length} ${this.t(tabs.length === 1 ? 'tabOpened' : 'tabsOpened')}.`); }
  async tagSelected() {
    const tabs = this.selectedTabs(); if (!tabs.length) return;
    const entered = await this.openTextDialog({ title: this.t('tagTitle'), label: this.t('tags'), placeholder: this.t('tagsPlaceholder'), help: this.t('tagsHelp'), submit: this.t('add') }); if (!entered) return;
    const tags = [...new Set(entered.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean))];
    tabs.forEach(tab => { tab.tags = [...new Set([...tab.tags, ...tags])]; }); await this.persist(); this.render(); this.showNotification(this.t('tagsAdded'));
  }
  async deleteSelected() {
    const tabs = this.selectedTabs(); if (!tabs.length) return;
    this.snapshot(); this.deletedTabs = { sessionId: this.currentSessionId, tabs: structuredClone(tabs) };
    this.currentSession.tabs = this.currentSession.tabs.filter(tab => !this.selectedIds.has(tab.id)); this.selectedIds.clear();
    await this.persist(); this.render(); this.showNotification(`${tabs.length} ${this.t(tabs.length === 1 ? 'tabDeleted' : 'tabsDeleted')}.`);
  }
  async undoDelete() {
    if (!this.deletedTabs) return;
    const session = this.sessions.find(item => item.id === this.deletedTabs.sessionId); if (!session) return;
    const urls = new Set(session.tabs.map(tab => tab.url)); session.tabs.push(...this.deletedTabs.tabs.filter(tab => !urls.has(tab.url)));
    this.deletedTabs = null; await this.persist(); this.render(); this.showNotification(this.t('deletionUndone'));
  }

  visibleTabs() {
    const query = this.elements.searchTabs.value.trim().toLowerCase(); const tag = this.elements.tagFilter.value;
    const tabs = this.currentSession.tabs.filter(tab => (!query || `${tab.title} ${tab.url} ${tab.tags.join(' ')}`.toLowerCase().includes(query)) && (!tag || tab.tags.includes(tag)));
    const sort = this.elements.sortTabs.value;
    return [...tabs].sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'domain' ? this.formatUrl(a.url).localeCompare(this.formatUrl(b.url)) : sort === 'oldest' ? a.savedAt - b.savedAt : b.savedAt - a.savedAt);
  }
  selectedTabs() { return this.currentSession.tabs.filter(tab => this.selectedIds.has(tab.id)); }

  render() {
    this.renderSessions(); this.renderTagFilter(); this.elements.list.replaceChildren();
    const tabs = this.visibleTabs();
    this.elements.list.append(...(tabs.length ? tabs.map(tab => this.createTabItem(tab)) : [this.createEmptyState()]));
    this.updateControls(tabs);
    this.elements.syncToggle.textContent = this.settings.syncEnabled ? 'Sync ✓' : this.t('enableSync');
  }
  renderSessions() {
    this.elements.sessionList.replaceChildren(...this.sessions.map(session => {
      const button = document.createElement('button'); button.type = 'button'; button.className = `session-pill${session.id === this.currentSessionId ? ' active' : ''}`; button.textContent = session.name; button.draggable = true;
      button.addEventListener('click', () => { this.currentSessionId = session.id; this.selectedIds.clear(); this.render(); });
      button.addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', session.id));
      button.addEventListener('dragover', event => event.preventDefault());
      button.addEventListener('drop', async event => { event.preventDefault(); const from = event.dataTransfer.getData('text/plain'); const to = session.id; if (from === to) return; const moved = this.sessions.splice(this.sessions.findIndex(item => item.id === from), 1)[0]; this.sessions.splice(this.sessions.findIndex(item => item.id === to), 0, moved); await this.persist(); this.render(); });
      return button;
    }));
  }
  renderTagFilter() {
    const selected = this.elements.tagFilter.value; const tags = [...new Set(this.currentSession.tabs.flatMap(tab => tab.tags))].sort();
    this.elements.tagFilter.replaceChildren(new Option(this.t('allTags'), ''), ...tags.map(tag => new Option(tag, tag))); this.elements.tagFilter.value = tags.includes(selected) ? selected : '';
  }
  createTabItem(tab) {
    const item = document.createElement('article'); item.className = 'tab-item'; item.draggable = this.elements.sortTabs.value === 'manual';
    item.addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', tab.id)); item.addEventListener('dragover', event => event.preventDefault()); item.addEventListener('drop', async event => { event.preventDefault(); const from = event.dataTransfer.getData('text/plain'); if (!from || from === tab.id) return; const tabs = this.currentSession.tabs; const moved = tabs.splice(tabs.findIndex(item => item.id === from), 1)[0]; tabs.splice(tabs.findIndex(item => item.id === tab.id), 0, moved); await this.persist(); this.render(); });
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = this.selectedIds.has(tab.id); checkbox.setAttribute('aria-label', this.t('selectTab', { name: tab.title })); checkbox.addEventListener('change', () => { checkbox.checked ? this.selectedIds.add(tab.id) : this.selectedIds.delete(tab.id); this.updateControls(this.visibleTabs()); });
    const details = document.createElement('div'); details.className = 'tab-details';
    const title = document.createElement('a'); title.className = 'tab-title'; title.href = tab.url; title.target = '_blank'; title.rel = 'noreferrer'; title.textContent = tab.title; title.title = tab.title;
    const domain = document.createElement('span'); domain.className = 'tab-domain'; domain.textContent = `${tab.pinned ? '★ ' : ''}${this.formatUrl(tab.url)}${this.duplicateCount(tab.url) ? ` · ${this.duplicateCount(tab.url)}×` : ''}${tab.linkStatus === 'broken' ? ' · ⚠' : ''}`; domain.title = tab.url; details.append(title, domain);
    if (tab.tags.length) { const tags = document.createElement('div'); tags.className = 'tags'; tab.tags.forEach(tag => { const chip = document.createElement('button'); chip.className = 'tag'; chip.type = 'button'; chip.textContent = `${tag} ×`; chip.title = this.t('removeTag', { tag }); chip.addEventListener('click', async () => { tab.tags = tab.tags.filter(item => item !== tag); await this.persist(); this.render(); this.showNotification(this.t('tagDeleted')); }); tags.append(chip); }); details.append(tags); }
    if (tab.note) { const note = document.createElement('span'); note.className = 'tab-note'; note.textContent = `✎ ${tab.note}`; note.title = tab.note; details.append(note); }
    const external = document.createElement('a'); external.className = 'external'; external.href = tab.url; external.target = '_blank'; external.rel = 'noreferrer'; external.textContent = '↗'; external.setAttribute('aria-label', this.t('openTab', { name: tab.title })); item.append(checkbox, details, external); return item;
  }
  createEmptyState() { const state = document.createElement('div'); state.className = 'empty-state'; const isFiltering = this.elements.searchTabs.value || this.elements.tagFilter.value; state.innerHTML = `<div><div class="empty-icon" aria-hidden="true">${isFiltering ? '⌕' : '⌑'}</div><h2>${this.t(isFiltering ? 'noResults' : 'emptySession')}</h2><p>${this.t(isFiltering ? 'noResultsText' : 'emptySessionText')}</p></div>`; return state; }
  formatUrl(url) { try { return new URL(url).hostname.replace(/^www\./, '') || url; } catch { return url; } }
  updateControls(visible) {
    const total = this.currentSession.tabs.length; const selected = this.selectedTabs().length; const visibleSelected = visible.filter(tab => this.selectedIds.has(tab.id)).length;
    this.elements.count.textContent = `${total} ${this.t(total === 1 ? 'savedOne' : 'savedMany')}`; this.elements.selectionCount.textContent = selected ? `${selected} ${this.t(selected === 1 ? 'selectedOne' : 'selectedMany')}` : this.t('noSelection');
    this.elements.selectAll.checked = visible.length > 0 && visibleSelected === visible.length; this.elements.selectAll.indeterminate = visibleSelected > 0 && visibleSelected < visible.length; this.elements.selectAll.disabled = visible.length === 0;
    [this.elements.openSelected, this.elements.pinSelected, this.elements.tagSelected, this.elements.noteSelected, this.elements.deleteSelected, this.elements.checkLinks].forEach(button => button.disabled = selected === 0); this.elements.undoDelete.disabled = !this.deletedTabs; this.elements.deleteSession.disabled = this.sessions.length === 1;
  }
  duplicateCount(url) { return this.sessions.reduce((count, session) => count + session.tabs.filter(tab => tab.url === url).length, 0) - 1; }
  async togglePins() { const tabs = this.selectedTabs(); this.snapshot(); const pin = !tabs.every(tab => tab.pinned); tabs.forEach(tab => { tab.pinned = pin; }); await this.persist(); this.render(); }
  async noteSelected() { const tabs = this.selectedTabs(); if (!tabs.length) return; const note = await this.openTextDialog({ title: 'Nota', label: 'Nota para las pestañas seleccionadas', value: tabs.length === 1 ? tabs[0].note : '', submit: 'Guardar' }); if (note === '') return; this.snapshot(); tabs.forEach(tab => { tab.note = note; }); await this.persist(); this.render(); }
  async addRule() { const domains = await this.openTextDialog({ title: 'Regla de guardado automático', label: 'Dominios', placeholder: 'ejemplo.com, docs.example.com', submit: 'Activar' }); if (!domains) return; this.rules.push({ id: crypto.randomUUID(), sessionId: this.currentSessionId, enabled: true, domains: domains.split(',').map(value => value.trim()).filter(Boolean) }); await this.persist(); this.showNotification('Regla activada.'); }
  async checkLinks() { if (!await chrome.permissions.request({ origins: ['<all_urls>'] })) return; const tabs = this.selectedTabs(); await Promise.all(tabs.map(async tab => { try { const response = await fetch(tab.url, { method: 'HEAD' }); tab.linkStatus = response.ok ? 'ok' : 'broken'; } catch { tab.linkStatus = 'broken'; } })); await this.persist(); this.render(); }
  async toggleSync() { this.settings.syncEnabled = !this.settings.syncEnabled; await chrome.storage.local.set({ [SETTINGS_KEY]: this.settings }); if (this.settings.syncEnabled) await chrome.storage.sync.set({ [STORAGE_KEY]: this.sessions }); this.elements.syncToggle.textContent = this.settings.syncEnabled ? 'Sync ✓' : this.t('enableSync'); }
  openHistory() {
    this.elements.historyList.replaceChildren();
    if (!this.history.length) { const item = document.createElement('div'); item.className = 'history-item'; item.textContent = this.language === 'es' ? 'Aún no hay cambios para restaurar.' : 'There are no changes to restore yet.'; this.elements.historyList.append(item); }
    this.history.forEach((snapshot, index) => { const item = document.createElement('div'); item.className = 'history-item'; const time = document.createElement('span'); time.textContent = new Intl.DateTimeFormat(this.language, { dateStyle: 'short', timeStyle: 'short' }).format(snapshot.at); const restore = document.createElement('button'); restore.textContent = this.language === 'es' ? 'Restaurar' : 'Restore'; restore.addEventListener('click', async () => { this.sessions = structuredClone(snapshot.sessions); this.currentSessionId = snapshot.sessionId; await this.persist(); this.elements.historyDialog.close(); this.render(); }); item.append(time, restore); this.elements.historyList.append(item); });
    this.elements.historyDialog.showModal();
  }
  exportTabs() {
    const file = new Blob([JSON.stringify({ version: 1, sessions: this.sessions }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = 'save-tabs-backup.json'; link.click(); URL.revokeObjectURL(url); this.showNotification(this.t('backupDownloaded'));
  }
  async importTabs(event) {
    const [file] = event.target.files; if (!file) return;
    try { const imported = this.normaliseSessions(JSON.parse(await file.text()).sessions); if (!imported.length) throw new Error(); this.sessions.push(...imported); await this.persist(); this.render(); this.showNotification(`${imported.length} ${this.t(imported.length === 1 ? 'sessionImported' : 'sessionsImported')}.`); } catch { this.showNotification(this.t('badBackup')); } finally { event.target.value = ''; }
  }
  openTextDialog({ title, label, placeholder = '', value = '', help = '', submit }) {
    const dialog = this.elements.textDialog; this.elements.dialogTitle.textContent = title; this.elements.dialogLabel.textContent = label; this.elements.dialogInput.placeholder = placeholder; this.elements.dialogInput.value = value; this.elements.dialogHelp.textContent = help; this.elements.dialogSubmit.textContent = submit;
    dialog.showModal(); requestAnimationFrame(() => { this.elements.dialogInput.focus(); this.elements.dialogInput.select(); });
    return new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'default' ? this.elements.dialogInput.value.trim() : ''), { once: true }));
  }
  showNotification(message) { clearTimeout(this.toastTimer); this.elements.toast.textContent = message; this.elements.toast.classList.add('visible'); this.toastTimer = setTimeout(() => this.elements.toast.classList.remove('visible'), 2800); }
}
document.addEventListener('DOMContentLoaded', () => new TabManager().init());
