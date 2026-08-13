# Save Tabs

[![CI](https://github.com/<your-user>/saveTabs/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-user>/saveTabs/actions/workflows/ci.yml)

A lightweight Chrome extension that turns the tabs in your current window into a small, persistent reading list. It is built for people who regularly collect research, documentation, or links to revisit without leaving dozens of tabs open.

![Save Tabs icon](saveTabs.png)

## What it does

- Saves every tab in the current window to local browser storage.
- Avoids duplicates by URL, so saving the same window twice is safe.
- Shows saved tabs as a compact, readable list with the site domain.
- Lets you select all or only a few tabs, then open or delete them in bulk.
- Organizes tabs into named sessions, with search, tag filters, and sorting.
- Imports and exports your library as a JSON backup, and lets you undo the last deletion.
- Keeps saved tabs after Chrome is restarted.
- Supports manual drag-and-drop ordering for tabs and sessions.
- Lets you pin tabs, attach notes, flag duplicate URLs across sessions, and check selected links on demand.
- Can auto-save matching domains into a session and optionally mirror your library with Chrome Sync.
- Keeps lightweight history snapshots that can restore the most recent library state.

## Install locally

1. Download this repository or clone it:

   ```bash
   git clone https://github.com/<your-user>/saveTabs.git
   ```

2. In Chrome, open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select this project folder.
5. Pin **Save Tabs** from the extensions menu if you want it visible in the toolbar.

## How to use it

1. Open the tabs you want to keep in one browser window.
2. Click the Save Tabs icon and select **Save current tabs**.
3. Usa el selector de sesiones para separar trabajo, investigación y colecciones personales. Crea una sesión con **+** y renómbrala con **✎**.
4. Busca por título, URL o etiqueta; filtra por etiqueta; u ordena la lista. `⌘/Ctrl + K` lleva el foco al buscador.
5. Selecciona una o más entradas y usa **Abrir**, **Etiquetar** o **Eliminar**. Puedes quitar una etiqueta individual haciendo clic sobre ella.
6. Selecciona **Deshacer eliminación** para restaurar el último grupo eliminado y usa **Exportar**/**Importar** para respaldos portables.
7. Usa el selector **ES/EN** de la cabecera para cambiar toda la interfaz entre español e inglés. La elección se conserva para futuras aperturas.

Atajo adicional: `⌘/Ctrl + Enter` guarda las pestañas actuales de la ventana.

Clicking a saved tab title also opens that tab directly.

## Privacy and permissions

Save Tabs stores its data only in `chrome.storage.local`; it does not send saved URLs or titles to a server.

| Permission | Why it is needed |
| --- | --- |
| `tabs` | Read the title and URL of tabs in the current window and open selected saved tabs. |
| `storage` | Persist the local saved-tab library. |

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 configuration and required permissions. |
| `saveTabs.html` | Popup structure. |
| `popup.css` | Responsive popup design and interaction states. |
| `popup.js` | Storage, selection, rendering, and tab actions. |

## Data migration

If you used a previous version, your existing flat list is migrated automatically into a session called **Mis pestañas** the first time you open version 1.2.0. No manual migration is required.

## Development

After changing extension files, return to `chrome://extensions` and click the reload icon on Save Tabs. There is no build step or external dependency.

### Checks and tests

Run the automated checks before opening a pull request or packaging a release:

```bash
npm test
npm run check
```

The test suite covers saved-tab migration, search and filtering, manual ordering, duplicate detection, translations, and automatic domain-saving rules. The GitHub Actions workflow runs the same validation on every push and pull request.

For browser-level release checks, follow [test/E2E_CHECKLIST.md](test/E2E_CHECKLIST.md) in Brave and Firefox.

## License

Released under the [MIT License](LICENSE).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the complete history of features and changes by version.
