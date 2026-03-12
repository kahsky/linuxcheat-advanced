# Linux Cheat Sheet — Advanced (`linuxcheat@kahsky`)

A Cinnamon panel applet that displays Linux commands organized by category, with an accordion-style menu. Click any command to copy it to the clipboard.

> *"One is glad to be of service."* — Bicentennial Man

**Author:** Karl Bustamante (kahsky)
**License:** GNU General Public License v3.0

---

## Features

- 14 categories: System, Files, Network, Apache, Nginx, MySQL, PHP, Git, Docker, APT, Systemd, SSH, Compression, Users
- Each category is color-coded
- Accordion behavior: opening one category closes the others
- Each command shows its description below in small text
- Click a command → copies it to clipboard + desktop notification
- **Bilingual:** English (default) / French — switchable in settings

### Available translations

| Language | Code | Status |
|----------|------|--------|
| English  | `en` | ✓ Default |
| French   | `fr` | ✓ Available |

---

## Installation

### Method 1 — Manual (recommended)

1. Copy the applet folder into your Cinnamon applets directory:

```bash
cp -r linuxcheat@kahsky ~/.local/share/cinnamon/applets/
```

2. Restart Cinnamon:

```bash
cinnamon --replace &
```

3. Right-click the panel → **Add applets to the panel**
4. Search for **Linux Cheat Sheet** and click **+**

### Method 2 — From this repository

```bash
git clone https://github.com/kahsky/linux-cheat-applets.git
cp -r linux-cheat-applets/linuxcheat@kahsky ~/.local/share/cinnamon/applets/
cinnamon --replace &
```

---

## Changing the Language

Right-click the applet icon in the panel → **Configure** → select **English** or **Français**.

The menu rebuilds instantly.

---

## Files

| File | Description |
|------|-------------|
| `applet.js` | Main applet logic |
| `metadata.json` | Applet metadata (UUID, name, version) |
| `settings-schema.json` | Settings definition (language selector) |
| `stylesheet.css` | Visual styles |
| `README.md` | This file |
| `LICENSE` | GNU GPL v3 license |

---

## License

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See the [LICENSE](LICENSE) file for the full license text.
