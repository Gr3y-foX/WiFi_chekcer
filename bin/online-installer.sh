#!/usr/bin/env zsh
# WiFi Scanner One-Line Installer
# This script can be installed with:
# curl -fsSL https://example.com/wifi-scanner-installer.sh | zsh

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║          WiFi VULNERABILITY SCANNER INSTALLER         ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo -e "${RED}Git is required but not installed.${RESET}"
  echo "Would you like to install Git now? (y/n)"
  read install_git
  if [[ "$install_git" =~ ^[Yy]$ ]]; then
    echo "Installing Git via Homebrew..."
    if ! command -v brew &> /dev/null; then
      echo "Homebrew not found. Installing Homebrew first..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install git
  else
    echo "Please install Git manually and try again."
    exit 1
  fi
fi

# Clone the repository
INSTALL_DIR="$HOME/Projects/wifi_checker"
mkdir -p "$INSTALL_DIR"
echo "Cloning WiFi Scanner repository..."

if [ -d "$INSTALL_DIR/wifi-vulnerability-scanner" ]; then
  echo -e "${YELLOW}Repository already exists. Updating...${RESET}"
  cd "$INSTALL_DIR/wifi-vulnerability-scanner"
  git pull
else
  cd "$INSTALL_DIR"
  git clone https://github.com/yourusername/wifi-vulnerability-scanner.git
  cd wifi-vulnerability-scanner
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the home installer
echo "Setting up home directory launcher..."
./bin/install-home.sh

echo -e "${GREEN}Installation complete!${RESET}"
echo "You can now run the WiFi scanner from your home directory with:"
echo -e "  ${BLUE}~/wifi-scanner.sh${RESET}"

exit 0
