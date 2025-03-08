// Constantes para reutilizar
const STORAGE_KEY = 'savedTabs';

// Clase para manejar el estado y operaciones de las pestañas
class TabManager {
  constructor() {
    this.savedTabs = [];
  }

  async init() {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    this.savedTabs = data[STORAGE_KEY] || [];
    this.render();
  }

  async saveTabs() {
    // Obtener las pestañas actuales
    const currentTabs = await chrome.tabs.query({currentWindow: true});
    const newTabs = currentTabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));

    // Combinar con las pestañas existentes evitando duplicados
    const combinedTabs = [...this.savedTabs];
    
    newTabs.forEach(newTab => {
      // Verificar si la pestaña ya existe
      const tabExists = combinedTabs.some(existingTab => 
        existingTab.url === newTab.url
      );
      
      // Solo agregar si no existe
      if (!tabExists) {
        combinedTabs.push(newTab);
      }
    });
    
    // Actualizar el estado y guardar
    this.savedTabs = combinedTabs;
    await chrome.storage.local.set({ [STORAGE_KEY]: this.savedTabs });
    
    const message = "All new tabs saved successfully!"
    
    this.showNotification(message);
    this.render();
  }

  async deleteTabs(urlsToDelete) {
    this.savedTabs = this.savedTabs.filter(tab => !urlsToDelete.includes(tab.url));
    await chrome.storage.local.set({ [STORAGE_KEY]: this.savedTabs });
    this.render();
  }

  showNotification(message) {
    // Reemplazar alert con una notificación más elegante
    alert(message); // Por ahora mantenemos el alert
  }

  createTableHTML() {
    return `
      <table class="tabs-table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          ${this.savedTabs.map(tab => `
            <tr>
              <td><input type="checkbox" data-url="${tab.url}" class="tab-checkbox"></td>
              <td>${tab.title}</td>
              <td><a href="${tab.url}" target="_blank">${tab.url}</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  createButtons() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-row';

    const openButton = this.createButton('Open selected tabs', 'button_get', () => {
      const selectedUrls = this.getSelectedUrls();
      selectedUrls.forEach(url => chrome.tabs.create({ url }));
    });

    const deleteButton = this.createButton('Delete selected tabs', 'button_delete', () => {
      const selectedUrls = this.getSelectedUrls();
      this.deleteTabs(selectedUrls);
    });

    buttonsContainer.append(openButton, deleteButton);
    return buttonsContainer;
  }

  createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
  }

  getSelectedUrls() {
    const checkboxes = document.querySelectorAll('.tab-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.url);
  }

  render() {
    const tableContainer = document.getElementById('table');
    tableContainer.innerHTML = this.createTableHTML();
    tableContainer.appendChild(this.createButtons());
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  const tabManager = new TabManager();
  tabManager.init();

  const saveButton = document.createElement('button');
  saveButton.id = 'save_tabs';
  saveButton.className = 'button_save';
  saveButton.textContent = 'Save tabs';
  saveButton.addEventListener('click', () => tabManager.saveTabs());

  document.getElementById('button_container').appendChild(saveButton);
});