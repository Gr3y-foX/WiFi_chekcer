#!/usr/bin/env zsh
# WiFi Scanner Launcher for home directory
# This script allows easy launching of the WiFi vulnerability scanner from the home directory

# Path to the project 
PROJECT_DIR="/Users/phenix/Projects/wifi_checker/wifi-vulnerability-scanner"

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
RESET="\033[0m"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}Error: WiFi scanner project not found at $PROJECT_DIR${RESET}"
  echo "Please update the PROJECT_DIR variable in this script with the correct path."
  exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}Warning: Node.js is required but not installed.${RESET}"
  echo "Would you like to install Node.js now? (y/n)"
  read install_node
  if [[ "$install_node" =~ ^[Yy]$ ]]; then
    echo "Installing Node.js via Homebrew..."
    if ! command -v brew &> /dev/null; then
      echo "Homebrew not found. Installing Homebrew first..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
  else
    echo "Please install Node.js manually and try again."
    exit 1
  fi
fi

# Function to check for updates
check_for_updates() {
  echo -e "${BLUE}Checking for updates...${RESET}"
  cd "$PROJECT_DIR"
  if [ -d ".git" ]; then
    git fetch
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse @{u})
    
    if [ "$LOCAL" != "$REMOTE" ]; then
      echo -e "${YELLOW}Updates available. Would you like to update now? (y/n)${RESET}"
      read update_now
      if [[ "$update_now" =~ ^[Yy]$ ]]; then
        git pull
        npm install
        echo -e "${GREEN}Successfully updated to the latest version!${RESET}"
      else
        echo -e "${YELLOW}Continuing with current version.${RESET}"
      fi
    else
      echo -e "${GREEN}You have the latest version.${RESET}"
    fi
  else
    echo -e "${YELLOW}Not a git repository. Skipping update check.${RESET}"
  fi
  echo ""
}

# Function to set up aliases
setup_aliases() {
  ALIASES_FILE="$HOME/wifi_aliases.zsh"
  ZSHRC="$HOME/.zshrc"
  
  # Create aliases file if it doesn't exist
  if [ ! -f "$ALIASES_FILE" ]; then
    echo "# WiFi Vulnerability Scanner aliases" > "$ALIASES_FILE"
    echo "alias wifi-scan='$HOME/wifi-scanner.sh'" >> "$ALIASES_FILE"
    echo "alias wifi-demo='cd $PROJECT_DIR && npm run demo'" >> "$ALIASES_FILE"
    echo "alias wifi-quick='cd $PROJECT_DIR && npm run quick-demo'" >> "$ALIASES_FILE"
    echo -e "${GREEN}Created aliases file at $ALIASES_FILE${RESET}"
  fi
  
  # Check if the aliases are already sourced in .zshrc
  if ! grep -q "source $ALIASES_FILE" "$ZSHRC"; then
    echo -e "\n# WiFi Scanner Aliases" >> "$ZSHRC"
    echo "source $ALIASES_FILE" >> "$ZSHRC"
    echo -e "${GREEN}Added aliases to your .zshrc file${RESET}"
    echo -e "${YELLOW}Restart your terminal or run 'source ~/.zshrc' to use the new aliases.${RESET}"
  else
    echo -e "${GREEN}Aliases are already set up in your .zshrc file${RESET}"
  fi
  
  echo -e "\nYou can now use these commands from anywhere:"
  echo -e "  ${MAGENTA}wifi-scan${RESET}  - Launch this menu"
  echo -e "  ${MAGENTA}wifi-demo${RESET}  - Run the interactive demo"
  echo -e "  ${MAGENTA}wifi-quick${RESET} - Run the quick demo"
}

# Display header
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║               WiFi VULNERABILITY SCANNER              ║"
echo "║                    HOME LAUNCHER                      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""
echo -e "${YELLOW}⚠️  Educational Security Tool - Use responsibly${RESET}"
echo ""

# Show menu options
echo -e "${BLUE}Select an option:${RESET}"
echo -e "1) Run full scanner"
echo -e "2) Run interactive demo"
echo -e "3) Run quick demo"
echo -e "4) Set up aliases for easy access"
echo -e "5) Check for updates"
echo -e "6) Install globally (requires admin rights)"
echo -e "7) Exit"
echo ""

# Get user choice
read "choice?Enter your choice (1-7): "

case $choice in
  1)
    cd "$PROJECT_DIR" && npm start
    ;;
  2)
    cd "$PROJECT_DIR" && npm run demo
    ;;
  3)
    cd "$PROJECT_DIR" && npm run quick-demo
    ;;
  4)
    setup_aliases
    ;;
  5)
    check_for_updates
    ;;
  6)
    echo -e "${YELLOW}Installing WiFi Scanner globally...${RESET}"
    cd "$PROJECT_DIR" && ./bin/install-global.sh
    ;;
  7)
    echo -e "${BLUE}Goodbye!${RESET}"
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid choice${RESET}"
    exit 1
    ;;
esac

# Ask if the user wants to return to the menu
if [[ "$choice" != "7" ]]; then
  echo ""
  echo -e "${BLUE}Would you like to return to the menu? (y/n)${RESET}"
  read return_to_menu
  
  if [[ "$return_to_menu" =~ ^[Yy]$ ]]; then
    exec $0  # Re-run this script
  fi
fi

exit 0
