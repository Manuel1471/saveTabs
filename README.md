# Save Tabs - Chrome Extension

A powerful Chrome extension for efficiently managing your browser tabs. Save, organize, and restore multiple tabs with ease, perfect for researchers, students, and professionals who work with numerous tabs.

## Features

- **Save Current Tabs**: Save all open tabs from your current window with a single click
- **Smart Saving**: Automatically prevents duplicate tabs when saving
- **Selective Management**: 
  - Select specific tabs to open or delete
  - Open multiple saved tabs at once
  - Delete unwanted saved tabs easily
- **Persistent Storage**: Tabs remain saved even after browser restart

## Installation

1. Clone this repository or download the ZIP file
```bash
git clone https://github.com/yourusername/save-tabs.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Click "Save tabs" to store all currently open tabs
3. View your saved tabs in the table
4. Use checkboxes to select specific tabs
5. Choose to:
   - Open selected tabs with "Open selected tabs"
   - Remove unwanted tabs with "Delete selected tabs"

## Technical Details

The extension uses:
- Chrome Storage API for persistent data
- Chrome Tabs API for tab management
- Modern JavaScript (async/await)
- CSS3 for styling
- HTML5 for structure

## Permissions Required

- `tabs`: To access and manage browser tabs
- `storage`: To save tabs data locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please open an issue in the repository.

---

Made with ❤️ for tab organization enthusiasts
