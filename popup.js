const STORAGE_KEY = 'tabSessions';
const LEGACY_STORAGE_KEY = 'savedTabs';
const SETTINGS_KEY = 'saveTabsSettings';
const RULES_KEY = 'autoSaveRules';
const HISTORY_KEY = 'saveTabsHistory';
const extensionApi = globalThis.browser?.tabs && globalThis.browser?.storage ? globalThis.browser : globalThis.chrome;
const ELEMENT_IDS = {
  list: 'tab-list', count: 'tab-count', selectionCount: 'selection-count', selectAll: 'select-all', sessionList: 'session-list', newSession: 'new-session', renameSession: 'rename-session', deleteSession: 'delete-session', searchTabs: 'search-tabs', clearSearch: 'clear-search', tagFilter: 'tag-filter', sortTabs: 'sort-tabs', openSelected: 'open-selected', pinSelected: 'pin-selected', tagSelected: 'tag-selected', noteSelected: 'note-selected', deleteSelected: 'delete-selected', saveTabs: 'save-tabs', exportTabs: 'export-tabs', importTabs: 'import-tabs', rules: 'rules', checkLinks: 'check-links', history: 'history', syncToggle: 'sync-toggle', undoDelete: 'undo-delete', libraryView: 'library-view', toolsView: 'tools-view', toolsSettings: 'tools-settings', inlineLanguage: 'inline-language', inlineTheme: 'inline-theme', inlineSync: 'inline-sync', inlineBackups: 'inline-backups', inlineRules: 'inline-rules', addInlineRule: 'add-inline-rule', toast: 'toast', languageToggle: 'language-toggle', expandLibrary: 'expand-library', textDialog: 'text-dialog', dialogTitle: 'dialog-title', dialogLabel: 'dialog-label', dialogInput: 'dialog-input', dialogHelp: 'dialog-help', dialogSubmit: 'dialog-submit', historyDialog: 'history-dialog', historyList: 'history-list', editTabDialog: 'edit-tab-dialog', editTabTitle: 'edit-tab-title', editTabNote: 'edit-tab-note', editTabTags: 'edit-tab-tags', editTabSession: 'edit-tab-session', importDialog: 'import-dialog', importSummary: 'import-summary'
};
const EXTRA_COPY = { es: { favorites: 'Favoritas', duplicates: 'Duplicadas', brokenLinks: 'Enlaces rotos', editTab: 'Editar pestaña', titleLabel: 'Título', noteLabel: 'Nota', moveTo: 'Mover a sesión', importPreview: 'Vista previa de importación', importConfirm: 'Importar y fusionar', importSummary: '{sessions} sesiones y {tabs} pestañas detectadas. Las sesiones con el mismo nombre se fusionarán y las URLs duplicadas se omitirán.', edited: 'Pestaña actualizada.', more: 'Más', tabsView: 'Pestañas', toolsView: 'Herramientas', toolsTitle: 'Organiza tu biblioteca', toolsDescription: 'Importa, respalda y administra tus pestañas guardadas.', exportHint: 'Descarga un respaldo', importHint: 'Fusiona un respaldo', rulesHint: 'Guardado automático', historyHint: 'Restaura cambios', sync: 'Sincronización', syncHint: 'Mantén tus datos', undoHint: 'Recupera pestañas', settings: 'Configuración', settingsDescription: 'Personaliza Save Tabs sin salir de tu biblioteca.', languageSetting: 'Idioma', themeSetting: 'Tema', scheduledBackups: 'Respaldos programados', addRule: 'Agregar regla', noRules: 'Aún no hay reglas.' }, en: { favorites: 'Favorites', duplicates: 'Duplicates', brokenLinks: 'Broken links', editTab: 'Edit tab', titleLabel: 'Title', noteLabel: 'Note', moveTo: 'Move to session', importPreview: 'Import preview', importConfirm: 'Import and merge', importSummary: '{sessions} sessions and {tabs} tabs detected. Matching session names will merge and duplicate URLs will be skipped.', edited: 'Tab updated.', more: 'More', tabsView: 'Tabs', toolsView: 'Tools', toolsTitle: 'Organize your library', toolsDescription: 'Import, back up, and manage your saved tabs.', exportHint: 'Download a backup', importHint: 'Merge a backup', rulesHint: 'Automatic saving', historyHint: 'Restore changes', sync: 'Sync', syncHint: 'Keep your data', undoHint: 'Recover tabs', settings: 'Settings', settingsDescription: 'Customize Save Tabs without leaving your library.', languageSetting: 'Language', themeSetting: 'Theme', scheduledBackups: 'Scheduled backups', addRule: 'Add rule', noRules: 'No rules yet.' } };
const COPY = {
  es: { library: 'BIBLIOTECA DE PESTAÑAS', newSession: 'Crear sesión', renameSession: 'Renombrar sesión', deleteSession: 'Eliminar sesión', currentSession: 'Sesión actual', sortTabs: 'Ordenar pestañas', searchPlaceholder: 'Buscar título, URL o etiqueta', searchTabs: 'Buscar pestañas guardadas', clearSearch: 'Limpiar búsqueda', filterTag: 'Filtrar por etiqueta', allTags: 'Todas', newest: 'Recientes', oldest: 'Antiguas', manual: 'Manual', titleSort: 'Título A–Z', domainSort: 'Dominio A–Z', selectVisible: 'Seleccionar visibles', saveCurrent: 'Guardar pestañas actuales', open: 'Abrir', pin: 'Fijar', note: 'Nota', tag: 'Etiquetar', delete: 'Eliminar', export: 'Exportar', import: 'Importar', rules: 'Reglas', checkLinks: 'Comprobar enlaces', history: 'Historial', enableSync: 'Activar sincronización', undoDelete: 'Deshacer eliminación', close: 'Cerrar', cancel: 'Cancelar', defaultSession: 'Mis pestañas', noSelection: 'Sin selección', selectedOne: 'seleccionada', selectedMany: 'seleccionadas', savedOne: 'guardada', savedMany: 'guardadas', noSavableTabs: 'No hay pestañas guardables en la última ventana activa.', alreadySaved: 'Las pestañas de esta ventana ya están guardadas.', tabSaved: 'pestaña guardada', tabsSaved: 'pestañas guardadas', sessionCreated: 'Sesión creada.', sessionUpdated: 'Nombre actualizado.', keepSession: 'Conserva al menos una sesión.', deleteSessionConfirm: '¿Eliminar “{name}” y todas sus pestañas?', sessionDeleted: 'Sesión eliminada.', tabOpened: 'pestaña abierta', tabsOpened: 'pestañas abiertas', tagsAdded: 'Etiquetas agregadas.', tabDeleted: 'pestaña eliminada', tabsDeleted: 'pestañas eliminadas', deletionUndone: 'Eliminación deshecha.', tagDeleted: 'Etiqueta eliminada.', backupDownloaded: 'Respaldo descargado.', sessionImported: 'sesión importada', sessionsImported: 'sesiones importadas', badBackup: 'Ese archivo no es un respaldo válido de Save Tabs.', selectTab: 'Seleccionar {name}', openTab: 'Abrir {name}', removeTag: 'Eliminar etiqueta {tag}', noResults: 'Sin resultados', noResultsText: 'Prueba otra búsqueda o elimina los filtros activos.', emptySession: 'Tu sesión está vacía', emptySessionText: 'Guarda las pestañas de la ventana actual para encontrarlas aquí después.', newSessionTitle: 'Nueva sesión', renameSessionTitle: 'Renombrar sesión', sessionName: 'Nombre de la sesión', newSessionPlaceholder: 'Ej. Investigación de UX', create: 'Crear', save: 'Guardar', tagTitle: 'Etiquetar pestañas', tags: 'Etiquetas', tagsPlaceholder: 'trabajo, leer después', tagsHelp: 'Separa varias etiquetas con comas.', add: 'Agregar' },
  en: { library: 'TAB LIBRARY', newSession: 'Create session', renameSession: 'Rename session', deleteSession: 'Delete session', currentSession: 'Current session', sortTabs: 'Sort tabs', searchPlaceholder: 'Search title, URL, or tag', searchTabs: 'Search saved tabs', clearSearch: 'Clear search', filterTag: 'Filter by tag', allTags: 'All', newest: 'Newest', oldest: 'Oldest', manual: 'Manual', titleSort: 'Title A–Z', domainSort: 'Domain A–Z', selectVisible: 'Select visible', saveCurrent: 'Save current tabs', open: 'Open', pin: 'Pin', note: 'Note', tag: 'Tag', delete: 'Delete', export: 'Export', import: 'Import', rules: 'Rules', checkLinks: 'Check links', history: 'History', enableSync: 'Enable sync', undoDelete: 'Undo deletion', close: 'Close', cancel: 'Cancel', defaultSession: 'My tabs', noSelection: 'No selection', selectedOne: 'selected', selectedMany: 'selected', savedOne: 'saved', savedMany: 'saved', noSavableTabs: 'There are no savable tabs in the last active window.', alreadySaved: 'All tabs in this window are already saved.', tabSaved: 'tab saved', tabsSaved: 'tabs saved', sessionCreated: 'Session created.', sessionUpdated: 'Name updated.', keepSession: 'Keep at least one session.', deleteSessionConfirm: 'Delete “{name}” and all its saved tabs?', sessionDeleted: 'Session deleted.', tabOpened: 'tab opened', tabsOpened: 'tabs opened', tagsAdded: 'Tags added.', tabDeleted: 'tab deleted', tabsDeleted: 'tabs deleted', deletionUndone: 'Deletion undone.', tagDeleted: 'Tag removed.', backupDownloaded: 'Backup downloaded.', sessionImported: 'session imported', sessionsImported: 'sessions imported', badBackup: 'That file is not a valid Save Tabs backup.', selectTab: 'Select {name}', openTab: 'Open {name}', removeTag: 'Remove tag {tag}', noResults: 'No results', noResultsText: 'Try another search or clear the active filters.', emptySession: 'Your session is empty', emptySessionText: 'Save tabs from the current window to find them here later.', newSessionTitle: 'New session', renameSessionTitle: 'Rename session', sessionName: 'Session name', newSessionPlaceholder: 'E.g. UX research', create: 'Create', save: 'Save', tagTitle: 'Tag tabs', tags: 'Tags', tagsPlaceholder: 'work, read later', tagsHelp: 'Separate multiple tags with commas.', add: 'Add' }
};

class TabManager {
  constructor() {
    this.sessions = [];
    this.currentSessionId = '';
    this.selectedIds = new Set();
    this.deletedTabs = null;
    this.toastTimer = null;
    this.language = 'es';
    this.rules = []; this.history = []; this.settings = {}; this.editingTabId = null; this.pendingImport = null;
    this.elements = Object.fromEntries(Object.entries(ELEMENT_IDS).map(([name, id]) => [name, document.querySelector(`#${id}`)]));
    const missing = Object.entries(this.elements).filter(([, element]) => !element).map(([name]) => ELEMENT_IDS[name]);
    if (missing.length) throw new Error(`Missing popup elements: ${missing.join(', ')}`);
  }

  async init() {
    const data = await extensionApi.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY, SETTINGS_KEY, RULES_KEY, HISTORY_KEY]);
    this.language = data[SETTINGS_KEY]?.language === 'en' ? 'en' : 'es';
    this.settings = data[SETTINGS_KEY] || {};
    document.documentElement.dataset.theme = this.settings.theme || 'light';
    if (new URLSearchParams(location.search).has('expanded')) { document.documentElement.classList.add('expanded'); document.body.classList.add('expanded'); }
    this.rules = Array.isArray(data[RULES_KEY]) ? data[RULES_KEY] : [];
    this.history = Array.isArray(data[HISTORY_KEY]) ? data[HISTORY_KEY] : [];
    this.applyTranslations();
    const remote = this.settings.syncEnabled ? await extensionApi.storage.sync.get(STORAGE_KEY) : {};
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
    this.elements.saveTabs.addEventListener('click', () => this.runAction(() => this.saveTabs()));
    this.elements.openSelected.addEventListener('click', () => this.runAction(() => this.openSelected()));
    this.elements.pinSelected.addEventListener('click', () => this.runAction(() => this.togglePins()));
    this.elements.tagSelected.addEventListener('click', () => this.runAction(() => this.tagSelected()));
    this.elements.noteSelected.addEventListener('click', () => this.runAction(() => this.noteSelected()));
    this.elements.deleteSelected.addEventListener('click', () => this.runAction(() => this.deleteSelected()));
    this.elements.undoDelete.addEventListener('click', () => this.runAction(() => this.undoDelete()));
    this.elements.newSession.addEventListener('click', () => this.runAction(() => this.newSession()));
    this.elements.renameSession.addEventListener('click', () => this.runAction(() => this.renameSession()));
    this.elements.deleteSession.addEventListener('click', () => this.runAction(() => this.deleteSession()));
    this.elements.selectAll.addEventListener('change', ({ target }) => { this.visibleTabs().forEach(tab => target.checked ? this.selectedIds.add(tab.id) : this.selectedIds.delete(tab.id)); this.render(); });
    [this.elements.searchTabs, this.elements.tagFilter, this.elements.sortTabs].forEach(element => element.addEventListener('input', () => this.render()));
    this.elements.clearSearch.addEventListener('click', () => { this.elements.searchTabs.value = ''; this.render(); this.elements.searchTabs.focus(); });
    this.elements.importTabs.addEventListener('change', event => this.importTabs(event));
    this.elements.exportTabs.addEventListener('click', () => this.runAction(() => this.exportTabs()));
    this.elements.rules.addEventListener('click', () => this.openToolsSettings());
    this.elements.checkLinks.addEventListener('click', () => this.runAction(() => this.checkLinks()));
    this.elements.history.addEventListener('click', () => this.runAction(() => this.openHistory()));
    document.querySelector('[data-close-history]').addEventListener('click', () => this.elements.historyDialog.close());
    document.querySelectorAll('[data-close-text-dialog]').forEach(button => button.addEventListener('click', () => this.elements.textDialog.close('cancel')));
    document.querySelectorAll('[data-close-edit-dialog]').forEach(button => button.addEventListener('click', () => this.elements.editTabDialog.close('cancel')));
    document.querySelectorAll('[data-close-import-dialog]').forEach(button => button.addEventListener('click', () => this.elements.importDialog.close('cancel')));
    this.elements.editTabDialog.addEventListener('close', () => this.runAction(() => this.saveEditedTab()));
    this.elements.importDialog.addEventListener('close', () => this.runAction(() => this.confirmImport()));
    this.elements.syncToggle.addEventListener('click', () => this.runAction(() => this.toggleSync()));
    this.elements.languageToggle.addEventListener('click', () => this.runAction(() => this.toggleLanguage()));
    this.elements.expandLibrary.addEventListener('click', () => this.runAction(() => this.openExpandedLibrary()));
    this.elements.libraryView.addEventListener('click', () => this.setView('library'));
    this.elements.toolsView.addEventListener('click', () => this.setView('tools'));
    this.elements.inlineLanguage.addEventListener('change', () => this.runAction(() => this.setInlineLanguage()));
    this.elements.inlineTheme.addEventListener('change', () => this.runAction(() => this.setInlineTheme()));
    this.elements.inlineSync.addEventListener('change', () => this.runAction(() => this.toggleInlineSync()));
    this.elements.inlineBackups.addEventListener('change', () => this.runAction(() => this.toggleInlineBackups()));
    this.elements.addInlineRule.addEventListener('click', () => this.runAction(() => this.addRule()));
    document.addEventListener('keydown', event => {
      if (this.elements.textDialog.open) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); this.elements.searchTabs.focus(); }
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); this.saveTabs(); }
    });
  }

  get currentSession() { return this.sessions.find(session => session.id === this.currentSessionId); }
  setView(view) { document.body.dataset.view = view; this.elements.libraryView.classList.toggle('active', view === 'library'); this.elements.toolsView.classList.toggle('active', view === 'tools'); }
  async openExpandedLibrary() { if (new URLSearchParams(location.search).has('expanded')) return; await extensionApi.tabs.create({ url: extensionApi.runtime.getURL('saveTabs.html?expanded=1') }); }
  openToolsSettings() { this.setView('tools'); this.elements.toolsSettings.hidden = false; this.renderToolsSettings(); this.elements.toolsSettings.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  renderToolsSettings() { this.elements.inlineLanguage.value = this.language; this.elements.inlineTheme.value = this.settings.theme || 'light'; this.elements.inlineSync.checked = Boolean(this.settings.syncEnabled); this.elements.inlineBackups.checked = Boolean(this.settings.backupEnabled); this.elements.inlineRules.textContent = this.rules.length ? this.rules.map(rule => `${rule.enabled ? '•' : '○'} ${rule.domains.join(', ')}`).join(' · ') : this.t('noRules'); }
  async setInlineLanguage() { this.language = this.elements.inlineLanguage.value; this.settings = { ...this.settings, language: this.language }; await extensionApi.storage.local.set({ [SETTINGS_KEY]: this.settings }); this.applyTranslations(); this.render(); this.renderToolsSettings(); }
  async setInlineTheme() { this.settings = { ...this.settings, theme: this.elements.inlineTheme.value }; document.documentElement.dataset.theme = this.settings.theme; await extensionApi.storage.local.set({ [SETTINGS_KEY]: this.settings }); }
  async toggleInlineSync() { if (Boolean(this.settings.syncEnabled) !== this.elements.inlineSync.checked) await this.toggleSync(); this.renderToolsSettings(); }
  async toggleInlineBackups() { this.settings = { ...this.settings, backupEnabled: this.elements.inlineBackups.checked }; await extensionApi.storage.local.set({ [SETTINGS_KEY]: this.settings }); if (extensionApi.alarms) { if (this.settings.backupEnabled) await extensionApi.alarms.create('save-tabs-scheduled-backup', { periodInMinutes: 10080 }); else await extensionApi.alarms.clear('save-tabs-scheduled-backup'); } }
  async runAction(action) { try { await action(); } catch (error) { console.error(error); const detail = error?.message ? ` ${error.message}` : ''; this.showNotification(`${this.language === 'es' ? 'No se pudo completar la acción.' : 'The action could not be completed.'}${detail}`); } }
  t(key, values = {}) { return (COPY[this.language][key] || EXTRA_COPY[this.language][key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? ''); }
  applyTranslations() {
    this.elements.languageToggle.textContent = this.language === 'es' ? 'EN' : 'ES';
    this.elements.languageToggle.setAttribute('aria-label', this.language === 'es' ? 'Switch to English' : 'Cambiar a español');
    this.elements.languageToggle.title = this.elements.languageToggle.getAttribute('aria-label');
    document.documentElement.lang = this.language;
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = this.t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = this.t(element.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', this.t(element.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-title]').forEach(element => { element.title = this.t(element.dataset.i18nTitle); });
  }
  createSession(name, tabs = []) { return { id: crypto.randomUUID(), name, tabs: tabs.map(tab => this.normaliseTab(tab)) }; }
  async toggleLanguage() { this.language = this.language === 'es' ? 'en' : 'es'; this.settings = { ...this.settings, language: this.language }; await extensionApi.storage.local.set({ [SETTINGS_KEY]: this.settings }); this.applyTranslations(); this.render(); }
  normaliseTab(tab) { return { id: tab.id || crypto.randomUUID(), url: tab.url, title: tab.title || tab.url, tags: Array.isArray(tab.tags) ? tab.tags : [], note: tab.note || '', pinned: Boolean(tab.pinned), linkStatus: tab.linkStatus || '', savedAt: tab.savedAt || Date.now() }; }
  normaliseSessions(value) { return Array.isArray(value) ? value.filter(session => session && typeof session.name === 'string' && Array.isArray(session.tabs)).map(session => ({ ...session, id: session.id || crypto.randomUUID(), tabs: session.tabs.filter(tab => tab?.url).map(tab => this.normaliseTab(tab)) })) : []; }
  async persist() { await extensionApi.storage.local.set({ [STORAGE_KEY]: this.sessions, [RULES_KEY]: this.rules, [HISTORY_KEY]: this.history }); if (this.settings.syncEnabled) await extensionApi.storage.sync.set({ [STORAGE_KEY]: this.sessions }); }
  snapshot() { this.history.unshift({ at: Date.now(), sessionId: this.currentSessionId, sessions: structuredClone(this.sessions) }); this.history = this.history.slice(0, 15); }

  async saveTabs() {
    let currentTabs = await extensionApi.tabs.query({ lastFocusedWindow: true });
    let savableTabs = currentTabs.filter(tab => tab.url);
    if (!savableTabs.length) {
      currentTabs = await extensionApi.tabs.query({ currentWindow: true });
      savableTabs = currentTabs.filter(tab => tab.url);
    }
    if (!savableTabs.length) return this.showNotification(this.t('noSavableTabs'));
    const existingUrls = new Set(this.currentSession.tabs.map(tab => tab.url));
    const additions = savableTabs.filter(tab => !existingUrls.has(tab.url)).map(tab => this.normaliseTab(tab));
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

  async openSelected() { const tabs = this.selectedTabs(); if (!tabs.length) return; await Promise.all(tabs.map(tab => extensionApi.tabs.create({ url: tab.url }))); this.showNotification(`${tabs.length} ${this.t(tabs.length === 1 ? 'tabOpened' : 'tabsOpened')}.`); }
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
    const tabs = this.currentSession.tabs.filter(tab => (!query || `${tab.title} ${tab.url} ${tab.tags.join(' ')}`.toLowerCase().includes(query)) && (!tag || tag === '__pinned' && tab.pinned || tag === '__duplicates' && this.duplicateCount(tab.url) > 0 || tag === '__broken' && tab.linkStatus === 'broken' || tab.tags.includes(tag)));
    const sort = this.elements.sortTabs.value;
    if (sort === 'manual') return tabs;
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
      const button = document.createElement('button'); button.type = 'button'; button.className = `session-pill${session.id === this.currentSessionId ? ' active' : ''}`; button.textContent = this.displaySessionName(session); button.draggable = true;
      button.addEventListener('click', () => { this.currentSessionId = session.id; this.selectedIds.clear(); this.render(); });
      button.addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', session.id));
      button.addEventListener('dragover', event => event.preventDefault());
      button.addEventListener('drop', async event => { event.preventDefault(); const from = event.dataTransfer.getData('text/plain'); const to = session.id; const fromIndex = this.sessions.findIndex(item => item.id === from); const toIndex = this.sessions.findIndex(item => item.id === to); if (from === to || fromIndex < 0 || toIndex < 0) return; const moved = this.sessions.splice(fromIndex, 1)[0]; this.sessions.splice(this.sessions.findIndex(item => item.id === to), 0, moved); await this.persist(); this.render(); });
      return button;
    }));
  }
  renderTagFilter() {
    const selected = this.elements.tagFilter.value; const tags = [...new Set(this.currentSession.tabs.flatMap(tab => tab.tags))].sort();
    const special = [['__pinned', this.t('favorites')], ['__duplicates', this.t('duplicates')], ['__broken', this.t('brokenLinks')]];
    this.elements.tagFilter.replaceChildren(new Option(this.t('allTags'), ''), ...special.map(([value, label]) => new Option(label, value)), ...tags.map(tag => new Option(tag, tag))); this.elements.tagFilter.value = [...special.map(([value]) => value), ...tags].includes(selected) ? selected : '';
  }
  displaySessionName(session) { return ['Mis pestañas', 'My tabs'].includes(session.name) ? this.t('defaultSession') : session.name; }
  createTabItem(tab) {
    const item = document.createElement('article'); item.className = 'tab-item'; item.draggable = this.elements.sortTabs.value === 'manual';
    item.addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', tab.id)); item.addEventListener('dragover', event => event.preventDefault()); item.addEventListener('drop', async event => { event.preventDefault(); const from = event.dataTransfer.getData('text/plain'); if (!from || from === tab.id) return; const tabs = this.currentSession.tabs; const fromIndex = tabs.findIndex(item => item.id === from); const toIndex = tabs.findIndex(item => item.id === tab.id); if (fromIndex < 0 || toIndex < 0) return; const moved = tabs.splice(fromIndex, 1)[0]; tabs.splice(tabs.findIndex(item => item.id === tab.id), 0, moved); await this.persist(); this.render(); });
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = this.selectedIds.has(tab.id); checkbox.setAttribute('aria-label', this.t('selectTab', { name: tab.title })); checkbox.addEventListener('change', () => { checkbox.checked ? this.selectedIds.add(tab.id) : this.selectedIds.delete(tab.id); this.updateControls(this.visibleTabs()); });
    const details = document.createElement('div'); details.className = 'tab-details';
    const title = document.createElement('a'); title.className = 'tab-title'; title.href = tab.url; title.target = '_blank'; title.rel = 'noreferrer'; title.textContent = tab.title; title.title = tab.title;
    const domain = document.createElement('span'); domain.className = 'tab-domain'; domain.textContent = `${tab.pinned ? '★ ' : ''}${this.formatUrl(tab.url)}${this.duplicateCount(tab.url) ? ` · ${this.duplicateCount(tab.url)}×` : ''}${tab.linkStatus === 'broken' ? ' · ⚠' : ''}`; domain.title = tab.url; details.append(title, domain);
    if (tab.tags.length) { const tags = document.createElement('div'); tags.className = 'tags'; tab.tags.forEach(tag => { const chip = document.createElement('button'); chip.className = 'tag'; chip.type = 'button'; chip.textContent = `${tag} ×`; chip.title = this.t('removeTag', { tag }); chip.addEventListener('click', async () => { tab.tags = tab.tags.filter(item => item !== tag); await this.persist(); this.render(); this.showNotification(this.t('tagDeleted')); }); tags.append(chip); }); details.append(tags); }
    if (tab.note) { const note = document.createElement('span'); note.className = 'tab-note'; note.textContent = `✎ ${tab.note}`; note.title = tab.note; details.append(note); }
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'tab-edit'; edit.textContent = '✎'; edit.title = this.t('editTab'); edit.setAttribute('aria-label', this.t('editTab')); edit.addEventListener('click', () => this.editTab(tab)); const external = document.createElement('a'); external.className = 'external'; external.href = tab.url; external.target = '_blank'; external.rel = 'noreferrer'; external.textContent = '↗'; external.setAttribute('aria-label', this.t('openTab', { name: tab.title })); item.append(checkbox, details, edit, external); return item;
  }
  createEmptyState() {
    const state = document.createElement('div');
    state.className = 'empty-state';
    const isFiltering = this.elements.searchTabs.value || this.elements.tagFilter.value;
    const content = document.createElement('div');
    const icon = document.createElement('div');
    icon.className = 'empty-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = isFiltering ? '⌕' : '⌑';
    const title = document.createElement('h2');
    title.textContent = this.t(isFiltering ? 'noResults' : 'emptySession');
    const description = document.createElement('p');
    description.textContent = this.t(isFiltering ? 'noResultsText' : 'emptySessionText');
    content.append(icon, title, description);
    state.append(content);
    return state;
  }
  formatUrl(url) { try { return new URL(url).hostname.replace(/^www\./, '') || url; } catch { return url; } }
  updateControls(visible) {
    const total = this.currentSession.tabs.length; const selected = this.selectedTabs().length; const visibleSelected = visible.filter(tab => this.selectedIds.has(tab.id)).length;
    this.elements.count.textContent = `${total} ${this.t(total === 1 ? 'savedOne' : 'savedMany')}`; this.elements.selectionCount.textContent = selected ? `${selected} ${this.t(selected === 1 ? 'selectedOne' : 'selectedMany')}` : this.t('noSelection');
    this.elements.selectAll.checked = visible.length > 0 && visibleSelected === visible.length; this.elements.selectAll.indeterminate = visibleSelected > 0 && visibleSelected < visible.length; this.elements.selectAll.disabled = visible.length === 0;
    [this.elements.openSelected, this.elements.pinSelected, this.elements.tagSelected, this.elements.noteSelected, this.elements.deleteSelected, this.elements.checkLinks].forEach(button => button.disabled = selected === 0); this.elements.undoDelete.disabled = !this.deletedTabs; this.elements.deleteSession.disabled = this.sessions.length === 1;
  }
  duplicateCount(url) { return this.sessions.reduce((count, session) => count + session.tabs.filter(tab => tab.url === url).length, 0) - 1; }
  async togglePins() { const tabs = this.selectedTabs(); this.snapshot(); const pin = !tabs.every(tab => tab.pinned); tabs.forEach(tab => { tab.pinned = pin; }); await this.persist(); this.render(); }
  async noteSelected() { const tabs = this.selectedTabs(); if (!tabs.length) return; const note = await this.openTextDialog({ title: this.language === 'es' ? 'Nota' : 'Note', label: this.language === 'es' ? 'Nota para las pestañas seleccionadas' : 'Note for selected tabs', value: tabs.length === 1 ? tabs[0].note : '', submit: this.t('save') }); if (note === '') return; this.snapshot(); tabs.forEach(tab => { tab.note = note; }); await this.persist(); this.render(); }
  async addRule() { const domains = await this.openTextDialog({ title: this.language === 'es' ? 'Regla de guardado automático' : 'Automatic saving rule', label: this.language === 'es' ? 'Dominios' : 'Domains', placeholder: 'example.com, docs.example.com', submit: this.language === 'es' ? 'Activar' : 'Enable' }); if (!domains) return; const values = domains.split(',').map(value => value.trim()).filter(Boolean); if (!values.length) return; this.snapshot(); this.rules.push({ id: crypto.randomUUID(), sessionId: this.currentSessionId, enabled: true, domains: values }); await this.persist(); this.showNotification(this.language === 'es' ? 'Regla activada.' : 'Rule enabled.'); }
  async checkLinks() { if (!await extensionApi.permissions.request({ origins: ['<all_urls>'] })) return; const tabs = this.selectedTabs(); await Promise.all(tabs.map(async tab => { try { const response = await fetch(tab.url, { method: 'HEAD' }); tab.linkStatus = response.ok ? 'ok' : 'broken'; } catch { tab.linkStatus = 'broken'; } })); await this.persist(); this.render(); }
  editTab(tab) { this.editingTabId = tab.id; this.elements.editTabTitle.value = tab.title; this.elements.editTabNote.value = tab.note; this.elements.editTabTags.value = tab.tags.join(', '); this.elements.editTabSession.replaceChildren(...this.sessions.map(session => new Option(this.displaySessionName(session), session.id, false, session.id === this.currentSessionId))); this.elements.editTabDialog.showModal(); }
  async saveEditedTab() { if (this.elements.editTabDialog.returnValue !== 'save' || !this.editingTabId) return; const tab = this.currentSession.tabs.find(item => item.id === this.editingTabId); if (!tab) return; this.snapshot(); tab.title = this.elements.editTabTitle.value.trim() || tab.url; tab.note = this.elements.editTabNote.value.trim(); tab.tags = [...new Set(this.elements.editTabTags.value.split(',').map(value => value.trim().toLowerCase()).filter(Boolean))]; const targetId = this.elements.editTabSession.value; if (targetId !== this.currentSessionId) { this.currentSession.tabs = this.currentSession.tabs.filter(item => item.id !== tab.id); this.sessions.find(session => session.id === targetId)?.tabs.push(tab); } this.editingTabId = null; await this.persist(); this.render(); this.showNotification(this.t('edited')); }
  async toggleSync() { this.settings.syncEnabled = !this.settings.syncEnabled; await extensionApi.storage.local.set({ [SETTINGS_KEY]: this.settings }); if (this.settings.syncEnabled) await extensionApi.storage.sync.set({ [STORAGE_KEY]: this.sessions }); this.elements.syncToggle.textContent = this.settings.syncEnabled ? 'Sync ✓' : this.t('enableSync'); }
  openHistory() {
    this.elements.historyList.replaceChildren();
    if (!this.history.length) { const item = document.createElement('div'); item.className = 'history-item'; item.textContent = this.language === 'es' ? 'Aún no hay cambios para restaurar.' : 'There are no changes to restore yet.'; this.elements.historyList.append(item); }
    this.history.forEach((snapshot, index) => { const item = document.createElement('div'); item.className = 'history-item'; const time = document.createElement('span'); time.textContent = new Intl.DateTimeFormat(this.language, { dateStyle: 'short', timeStyle: 'short' }).format(snapshot.at); const restore = document.createElement('button'); restore.textContent = this.language === 'es' ? 'Restaurar' : 'Restore'; restore.addEventListener('click', async () => { this.sessions = structuredClone(snapshot.sessions); this.currentSessionId = snapshot.sessionId; await this.persist(); this.elements.historyDialog.close(); this.render(); }); item.append(time, restore); this.elements.historyList.append(item); });
    this.elements.historyDialog.showModal();
  }
  exportTabs() {
    const file = new Blob([JSON.stringify({ version: 1, sessions: this.sessions }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = 'save-tabs-backup.json'; link.style.display = 'none'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); this.showNotification(this.t('backupDownloaded'));
  }
  async importTabs(event) {
    const [file] = event.target.files; if (!file) return;
    try { const imported = this.normaliseSessions(JSON.parse(await file.text()).sessions); if (!imported.length) throw new Error(); this.pendingImport = imported; const tabs = imported.reduce((total, session) => total + session.tabs.length, 0); this.elements.importSummary.textContent = this.t('importSummary', { sessions: imported.length, tabs }); this.elements.importDialog.showModal(); } catch { this.showNotification(this.t('badBackup')); } finally { event.target.value = ''; }
  }
  async confirmImport() { if (this.elements.importDialog.returnValue !== 'save' || !this.pendingImport) return; this.snapshot(); this.pendingImport.forEach(incoming => { const target = this.sessions.find(session => session.name.toLowerCase() === incoming.name.toLowerCase()); if (!target) { this.sessions.push(incoming); return; } const urls = new Set(target.tabs.map(tab => tab.url)); target.tabs.push(...incoming.tabs.filter(tab => !urls.has(tab.url))); }); const count = this.pendingImport.length; this.pendingImport = null; await this.persist(); this.render(); this.showNotification(`${count} ${this.t(count === 1 ? 'sessionImported' : 'sessionsImported')}.`); }
  openTextDialog({ title, label, placeholder = '', value = '', help = '', submit }) {
    const dialog = this.elements.textDialog; this.elements.dialogTitle.textContent = title; this.elements.dialogLabel.textContent = label; this.elements.dialogInput.placeholder = placeholder; this.elements.dialogInput.value = value; this.elements.dialogHelp.textContent = help; this.elements.dialogSubmit.textContent = submit;
    dialog.showModal(); requestAnimationFrame(() => { this.elements.dialogInput.focus(); this.elements.dialogInput.select(); });
    return new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'default' ? this.elements.dialogInput.value.trim() : ''), { once: true }));
  }
  showNotification(message) { clearTimeout(this.toastTimer); this.elements.toast.textContent = message; this.elements.toast.classList.add('visible'); this.toastTimer = setTimeout(() => this.elements.toast.classList.remove('visible'), 2800); }
}
document.addEventListener('DOMContentLoaded', () => new TabManager().init());
