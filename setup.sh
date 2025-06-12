#!/bin/bash
# WiFi Vulnerability Scanner - Setup Script
# This script installs required system dependencies for the scanner

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║        WiFi Vulnerability Scanner - Setup             ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""
echo -e "${YELLOW}This script will install required dependencies for the WiFi Vulnerability Scanner.${RESET}"
echo "Depending on your system, you may be prompted for your password."
echo ""

# Check the operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo -e "${BLUE}Setting up for macOS...${RESET}"
    
    # Check for Homebrew
    if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}Homebrew not found. Installing Homebrew...${RESET}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo -e "${GREEN}Homebrew already installed.${RESET}"
    fi
    
    # Install Node.js if not installed
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Node.js not found. Installing Node.js...${RESET}"
        brew install node
    else
        echo -e "${GREEN}Node.js already installed: $(node -v)${RESET}"
    fi
    
    # Set up airport utility
    echo -e "${BLUE}Setting up airport utility...${RESET}"
    if [[ ! -f /usr/local/bin/airport ]]; then
        echo "Creating symlink for airport utility (requires sudo):"
        sudo ln -sf /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport
        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}Airport utility successfully linked.${RESET}"
        else
            echo -e "${RED}Failed to create symlink for airport utility.${RESET}"
            echo "You may need to run the WiFi scanner with elevated privileges."
        fi
    else
        echo -e "${GREEN}Airport utility already linked.${RESET}"
    fi
    
    # Install nmap for port scanning if not present
    if ! command -v nmap &> /dev/null; then
        echo -e "${YELLOW}nmap not found. Installing nmap...${RESET}"
        brew install nmap
    else
        echo -e "${GREEN}nmap already installed.${RESET}"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo -e "${BLUE}Setting up for Linux...${RESET}"
    
    # Detect package manager
    if command -v apt &> /dev/null; then
        # Debian/Ubuntu
        PKG_MANAGER="apt"
        UPDATE_CMD="apt update"
        INSTALL_CMD="apt install -y"
    elif command -v dnf &> /dev/null; then
        # Fedora/RHEL
        PKG_MANAGER="dnf"
        UPDATE_CMD="dnf check-update"
        INSTALL_CMD="dnf install -y"
    elif command -v pacman &> /dev/null; then
        # Arch Linux
        PKG_MANAGER="pacman"
        UPDATE_CMD="pacman -Sy"
        INSTALL_CMD="pacman -S --noconfirm"
    else
        echo -e "${RED}Unsupported Linux distribution. Please install dependencies manually:${RESET}"
        echo "- Node.js"
        echo "- wireless-tools"
        echo "- nmap"
        exit 1
    fi
    
    # Update package lists
    echo -e "${YELLOW}Updating package lists...${RESET}"
    sudo $UPDATE_CMD
    
    # Install Node.js if not installed
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Node.js not found. Installing Node.js...${RESET}"
        sudo $INSTALL_CMD nodejs npm
    else
        echo -e "${GREEN}Node.js already installed: $(node -v)${RESET}"
    fi
    
    # Install wireless tools and nmap
    echo -e "${YELLOW}Installing required packages...${RESET}"
    if [[ "$PKG_MANAGER" == "apt" ]]; then
        # Ubuntu/Debian specific packages
        sudo $INSTALL_CMD wireless-tools iw network-manager nmap net-tools
        
        # Install additional useful packages for Ubuntu
        sudo $INSTALL_CMD curl wget git
        
        echo -e "${GREEN}Ubuntu packages installed successfully.${RESET}"
    else
        sudo $INSTALL_CMD wireless-tools nmap
    fi
    
    # Set up permissions for network scanning
    echo -e "${BLUE}Setting up network scanning permissions...${RESET}"
    
    # Check if user is in netdev group (Ubuntu/Debian)
    if groups | grep -q netdev; then
        echo -e "${GREEN}User is already in netdev group.${RESET}"
    else
        echo -e "${YELLOW}Adding user to netdev group for network access...${RESET}"
        sudo usermod -a -G netdev $USER
        echo -e "${YELLOW}You may need to log out and back in for group changes to take effect.${RESET}"
    fi
    
    echo "Note: You may need to run the WiFi scanner with sudo privileges for full functionality."
    
else
    # Unsupported OS
    echo -e "${RED}Unsupported operating system: $OSTYPE${RESET}"
    echo "This script supports macOS and Linux only."
    exit 1
fi

# Install npm dependencies
echo -e "${BLUE}Installing npm dependencies...${RESET}"
npm install

echo ""
echo -e "${GREEN}Setup completed successfully!${RESET}"
echo ""
echo "You can now run the scanner using one of these commands:"
echo -e "  ${BLUE}npm start${RESET}        - Run the full scanner"
echo -e "  ${BLUE}npm run demo${RESET}     - Interactive demo with all features"
echo -e "  ${BLUE}npm run quick-demo${RESET} - Non-interactive demo focusing on brute force protection"
echo ""
echo -e "${YELLOW}Note: Some advanced scanning features may require running with elevated privileges.${RESET}"
