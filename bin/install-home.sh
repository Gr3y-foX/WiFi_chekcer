#!/usr/bin/env zsh
# WiFi Scanner Quick Install Script
# This script sets up the WiFi Scanner in your home directory for easy access

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
echo -e "${YELLOW}This script will set up the WiFi Vulnerability Scanner for easy access.${RESET}"
echo ""

# Default project location
PROJECT_DIR="/Users/phenix/Projects/wifi_checker/wifi-vulnerability-scanner"

# Check if the directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${YELLOW}Default project directory not found.${RESET}"
  echo "Please enter the full path to your WiFi Scanner project directory:"
  read custom_dir
  
  if [ ! -d "$custom_dir" ]; then
    echo -e "${RED}Error: Directory not found.${RESET}"
    echo "Please locate the WiFi Scanner project and try again."
    exit 1
  fi
  
  PROJECT_DIR="$custom_dir"
fi

echo -e "${GREEN}Found WiFi Scanner project at: $PROJECT_DIR${RESET}"
echo ""

# Create launcher script
LAUNCHER_PATH="$HOME/wifi-scanner.sh"
echo "Creating launcher script at $LAUNCHER_PATH..."

# Copy launcher from project if it exists, otherwise download it
if [ -f "$PROJECT_DIR/bin/home-launcher.sh" ]; then
  cp "$PROJECT_DIR/bin/home-launcher.sh" "$LAUNCHER_PATH"
else
  # Create basic launcher from this repository
  cat > "$LAUNCHER_PATH" << 'EOL'
#!/usr/bin/env zsh
# WiFi Scanner Launcher for home directory

# Path to the project 
PROJECT_DIR="/Users/phenix/Projects/wifi_checker/wifi-vulnerability-scanner"

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}Error: WiFi scanner project not found at $PROJECT_DIR${RESET}"
  exit 1
fi

# Display header
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║               WiFi VULNERABILITY SCANNER              ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

# Show menu options
echo "Select an option:"
echo "1) Run full scanner"
echo "2) Run interactive demo"
echo "3) Run quick demo"
echo "4) Exit"
echo ""

# Get user choice
read "choice?Enter your choice (1-4): "

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
    echo -e "${BLUE}Goodbye!${RESET}"
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid choice${RESET}"
    exit 1
    ;;
esac

exit 0
EOL

  # Replace project directory with actual path
  sed -i '' "s|PROJECT_DIR=.*|PROJECT_DIR=\"$PROJECT_DIR\"|" "$LAUNCHER_PATH"
fi

# Make launcher executable
chmod +x "$LAUNCHER_PATH"

# Create aliases file
ALIASES_FILE="$HOME/wifi_aliases.zsh"
echo "Creating aliases file at $ALIASES_FILE..."

cat > "$ALIASES_FILE" << EOL
# WiFi Vulnerability Scanner aliases
alias wifi-scan='$HOME/wifi-scanner.sh'
alias wifi-demo='cd $PROJECT_DIR && npm run demo'
alias wifi-quick='cd $PROJECT_DIR && npm run quick-demo'
EOL

# Update .zshrc if needed
ZSHRC="$HOME/.zshrc"
if ! grep -q "source.*wifi_aliases.zsh" "$ZSHRC"; then
  echo "Updating .zshrc file..."
  echo "" >> "$ZSHRC"
  echo "# WiFi Vulnerability Scanner" >> "$ZSHRC"
  echo "source $ALIASES_FILE" >> "$ZSHRC"
fi

echo -e "${GREEN}Setup completed!${RESET}"
echo ""
echo "You can now use these commands:"
echo -e "  ${BLUE}./wifi-scanner.sh${RESET}    - Run the scanner menu from home directory"
echo -e "  ${BLUE}wifi-scan${RESET}          - Run the scanner menu (after restarting terminal)"
echo -e "  ${BLUE}wifi-demo${RESET}          - Run interactive demo (after restarting terminal)"
echo -e "  ${BLUE}wifi-quick${RESET}         - Run quick demo (after restarting terminal)"
echo ""
echo -e "${YELLOW}Tip: To use the aliases right away, run:${RESET} source ~/.zshrc"
echo ""
echo -e "${GREEN}Would you like to run the WiFi scanner now? (y/n)${RESET}"
read run_now

if [[ "$run_now" =~ ^[Yy]$ ]]; then
  $LAUNCHER_PATH
fi

exit 0
