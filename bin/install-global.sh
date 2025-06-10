#!/usr/bin/env bash
# Global WiFi Scanner Installation Script
# This script installs the WiFi scanner for global access

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

# Get script location and project directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Determine installation location
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  INSTALL_DIR="/usr/local/bin"
else
  # Linux and others
  INSTALL_DIR="/usr/local/bin"
fi

# Make sure the bin directory exists
mkdir -p "$SCRIPT_DIR"

echo -e "${BLUE}WiFi Vulnerability Scanner - Global Installation${RESET}"
echo ""

# Check for required permissions
if [ ! -w "$INSTALL_DIR" ]; then
  echo -e "${YELLOW}Installation requires admin privileges.${RESET}"
  sudo_prefix="sudo"
else
  sudo_prefix=""
fi

# Make the script executable
chmod +x "$SCRIPT_DIR/wifi-scanner"

# Create symlink to make it available globally
echo -e "Installing to ${INSTALL_DIR}/wifi-scanner..."
$sudo_prefix ln -sf "$SCRIPT_DIR/wifi-scanner" "$INSTALL_DIR/wifi-scanner"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Installation successful!${RESET}"
  echo ""
  echo "You can now run the WiFi vulnerability scanner from anywhere using:"
  echo -e "  ${BLUE}wifi-scanner${RESET}          - Interactive menu"
  echo -e "  ${BLUE}wifi-scanner start${RESET}    - Run the full scanner"
  echo -e "  ${BLUE}wifi-scanner demo${RESET}     - Run the interactive demo"
  echo -e "  ${BLUE}wifi-scanner quick${RESET}    - Run the quick demo"
  echo -e "  ${BLUE}wifi-scanner help${RESET}     - Show help information"
else
  echo -e "${RED}Installation failed.${RESET}"
  echo "Please try running with sudo:"
  echo "  sudo $0"
fi

# Update package.json to include the bin script
echo -e "\n${BLUE}Updating package.json...${RESET}"
node -e "
  const fs = require('fs');
  const path = require('path');
  const pkgPath = path.join('$PROJECT_DIR', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  // Add bin entry if it doesn't exist
  if (!pkg.bin) {
    pkg.bin = { 'wifi-scanner': './bin/wifi-scanner' };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('Added bin entry to package.json');
  } else if (!pkg.bin['wifi-scanner']) {
    pkg.bin['wifi-scanner'] = './bin/wifi-scanner';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('Added wifi-scanner to bin entries');
  } else {
    console.log('Bin entry already exists');
  }
"

echo -e "\n${GREEN}Setup complete!${RESET}"
