#!/usr/bin/env bash
# macOS Application Wrapper for WiFi Vulnerability Scanner
# This script provides a more native experience on macOS

# Get script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Text colors for terminal
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

# Change to the project directory
cd "$PROJECT_DIR" || exit 1

# Display header with macOS styling
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║           WiFi VULNERABILITY SCANNER (macOS)          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

# Check if terminal has proper permissions for the scanner
if [ "$(id -u)" != "0" ]; then
  echo -e "${YELLOW}⚠️  Some advanced scanning features require administrator privileges.${RESET}"
  echo -e "${YELLOW}   You can run this scanner with sudo for full functionality.${RESET}"
  echo ""
fi

# Use macOS dialog to display a menu
MODE=$(osascript -e '
tell application "System Events"
  activate
  set theResponse to button returned of (display dialog "Welcome to WiFi Vulnerability Scanner\n\nPlease select an option:" buttons {"Full Scanner", "Interactive Demo", "Quick Demo", "Cancel"} default button 1 with title "WiFi Vulnerability Scanner" with icon caution)
end tell')

# Process selected mode
case "$MODE" in
  "Full Scanner")
    npm start
    ;;
  "Interactive Demo")
    npm run demo
    ;;
  "Quick Demo")
    npm run quick-demo
    ;;
  "Cancel"|*)
    echo -e "${YELLOW}Scanner canceled.${RESET}"
    exit 0
    ;;
esac

# Keep terminal open until user presses a key
echo ""
echo -e "${GREEN}Scan complete!${RESET}"
read -p "Press any key to exit..." -n 1 -r

exit 0
