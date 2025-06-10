# WiFi Vulnerability Scanner - Easy Access Guide

This guide explains all the ways you can run the WiFi Vulnerability Scanner from anywhere on your system.

## 1. Home Directory Launcher (Recommended for Single User)

We've created a convenient launcher script in your home directory:

```bash
~/wifi-scanner.sh
```

**Features:**
- Interactive menu
- Easy access from home directory
- Options to run different scanner modes
- Built-in update checker
- Automatic alias setup

**Aliases:**
After setting up with option 4 in the menu, you can use:
```bash
wifi-scan   # Run the scanner menu
wifi-demo   # Run the interactive demo directly
wifi-quick  # Run the quick demo directly
```

## 2. Global Installation (Recommended for System-wide Access)

Install the scanner globally to run from anywhere:
```bash
cd ~/Projects/wifi_checker/wifi-vulnerability-scanner
./bin/install-global.sh
```

**Global Commands:**
```bash
wifi-scanner         # Run with interactive menu
wifi-scanner start   # Run the full scanner
wifi-scanner demo    # Run the interactive demo
wifi-scanner quick   # Run the quick demo
```

## 3. macOS Application-Style Experience

For a more native macOS experience:
```bash
~/Projects/wifi_checker/wifi-vulnerability-scanner/bin/wifi-scanner-macos.sh
```

This launcher uses macOS dialogs for selecting options.

## 4. One-Line Installation

Fresh installation can be done with a single command:
```bash
curl -fsSL https://example.com/wifi-scanner-installer.sh | zsh
```

This will:
1. Clone the repository
2. Install dependencies
3. Set up the home directory launcher

## Installation Scripts

| Script | Purpose |
|--------|---------|
| `~/install-wifi-scanner.sh` | Quick setup from home directory |
| `bin/install-home.sh` | Sets up home directory launcher |
| `bin/install-global.sh` | Installs scanner globally |
| `bin/online-installer.sh` | One-line internet installation script |

## Troubleshooting

If the launcher script doesn't work:
1. Check that the project path is correct
2. Ensure Node.js is installed
3. Try running `npm install` in the project directory
4. Check that all scripts are executable (`chmod +x script.sh`)

For further assistance, please refer to the README.md file in the project repository.
