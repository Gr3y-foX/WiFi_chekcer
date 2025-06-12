#!/usr/bin/env bash
# Linux WiFi Vulnerability Scanner Launcher
# This script provides a Linux-specific interface for the WiFi scanner

# Get script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
RESET="\033[0m"

# Change to the project directory
cd "$PROJECT_DIR" || exit 1

# Display header with Linux styling
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║           WiFi VULNERABILITY SCANNER (Linux)          ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

# Check Linux distribution
get_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$PRETTY_NAME"
    elif command -v lsb_release >/dev/null 2>&1; then
        lsb_release -d | cut -f2
    else
        echo "Unknown Linux"
    fi
}

echo -e "${CYAN}Detected system: $(get_distro)${RESET}"
echo ""

# Check for required tools
check_tools() {
    local missing_tools=()
    
    echo -e "${BLUE}Checking for required WiFi scanning tools...${RESET}"
    
    if ! command -v iwlist >/dev/null 2>&1; then
        missing_tools+=("wireless-tools")
    else
        echo -e "${GREEN}✓ iwlist (wireless-tools) found${RESET}"
    fi
    
    if ! command -v nmcli >/dev/null 2>&1; then
        missing_tools+=("network-manager")
    else
        echo -e "${GREEN}✓ nmcli (NetworkManager) found${RESET}"
    fi
    
    if ! command -v iw >/dev/null 2>&1; then
        missing_tools+=("iw")
    else
        echo -e "${GREEN}✓ iw found${RESET}"
    fi
    
    if [ ${#missing_tools[@]} -eq 3 ]; then
        echo -e "${RED}⚠️  No WiFi scanning tools found!${RESET}"
        echo ""
        echo "To use the WiFi scanner, you need to install at least one of these tools:"
        echo ""
        
        # Detect package manager and provide instructions
        if command -v apt >/dev/null 2>&1; then
            echo -e "${CYAN}For Debian/Ubuntu systems:${RESET}"
            echo "  sudo apt update"
            echo "  sudo apt install wireless-tools iw network-manager"
        elif command -v dnf >/dev/null 2>&1; then
            echo -e "${CYAN}For Fedora/RHEL systems:${RESET}"
            echo "  sudo dnf install wireless-tools iw NetworkManager"
        elif command -v pacman >/dev/null 2>&1; then
            echo -e "${CYAN}For Arch Linux:${RESET}"
            echo "  sudo pacman -S wireless_tools iw networkmanager"
        elif command -v zypper >/dev/null 2>&1; then
            echo -e "${CYAN}For openSUSE:${RESET}"
            echo "  sudo zypper install wireless-tools iw NetworkManager"
        else
            echo -e "${CYAN}Install these packages using your distribution's package manager:${RESET}"
            echo "  - wireless-tools (provides iwlist, iwconfig)"
            echo "  - iw (modern wireless utility)"
            echo "  - network-manager (provides nmcli)"
        fi
        
        echo ""
        echo -e "${YELLOW}Would you like to try installing these tools now? (y/n)${RESET}"
        read -r install_tools
        
        if [[ "$install_tools" =~ ^[Yy]$ ]]; then
            install_wifi_tools
        else
            echo -e "${RED}Cannot proceed without WiFi scanning tools.${RESET}"
            exit 1
        fi
    elif [ ${#missing_tools[@]} -gt 0 ]; then
        echo -e "${YELLOW}Some tools are missing: ${missing_tools[*]}${RESET}"
        echo "The scanner will work with available tools, but installing all tools provides better compatibility."
    else
        echo -e "${GREEN}✓ All WiFi scanning tools are available${RESET}"
    fi
    
    echo ""
}

# Install WiFi tools
install_wifi_tools() {
    echo -e "${BLUE}Installing WiFi scanning tools...${RESET}"
    
    if command -v apt >/dev/null 2>&1; then
        sudo apt update && sudo apt install -y wireless-tools iw network-manager
    elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y wireless-tools iw NetworkManager
    elif command -v pacman >/dev/null 2>&1; then
        sudo pacman -S --noconfirm wireless_tools iw networkmanager
    elif command -v zypper >/dev/null 2>&1; then
        sudo zypper install -y wireless-tools iw NetworkManager
    else
        echo -e "${RED}Could not detect package manager. Please install tools manually.${RESET}"
        return 1
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ WiFi tools installed successfully${RESET}"
    else
        echo -e "${RED}Failed to install WiFi tools${RESET}"
        return 1
    fi
}

# Check permissions
check_permissions() {
    echo -e "${BLUE}Checking permissions...${RESET}"
    
    if [ "$(id -u)" = "0" ]; then
        echo -e "${GREEN}✓ Running as root - all scanning features available${RESET}"
    else
        echo -e "${YELLOW}⚠️  Running as regular user${RESET}"
        echo "Some advanced scanning features may require root privileges."
        echo "You can run the scanner with 'sudo' for full functionality."
        
        # Check if user is in netdev group (some distributions)
        if groups | grep -q netdev; then
            echo -e "${GREEN}✓ User is in 'netdev' group - basic scanning should work${RESET}"
        fi
    fi
    echo ""
}

# Display wireless interface information
show_interface_info() {
    echo -e "${BLUE}WiFi Interface Information:${RESET}"
    
    # Try to find wireless interfaces
    local interfaces=()
    
    # Method 1: Check /proc/net/wireless
    if [ -f /proc/net/wireless ]; then
        while IFS= read -r line; do
            if [[ $line =~ ^[[:space:]]*([a-zA-Z0-9]+): ]]; then
                interfaces+=("${BASH_REMATCH[1]}")
            fi
        done < /proc/net/wireless
    fi
    
    # Method 2: Use iwconfig if available
    if [ ${#interfaces[@]} -eq 0 ] && command -v iwconfig >/dev/null 2>&1; then
        local iwconfig_output
        iwconfig_output=$(iwconfig 2>/dev/null)
        while IFS= read -r line; do
            if [[ $line =~ ^([a-zA-Z0-9]+)[[:space:]]+IEEE ]]; then
                interfaces+=("${BASH_REMATCH[1]}")
            fi
        done <<< "$iwconfig_output"
    fi
    
    if [ ${#interfaces[@]} -eq 0 ]; then
        echo -e "${YELLOW}  No wireless interfaces detected${RESET}"
        echo "  This might indicate:"
        echo "  - No WiFi adapter is present"
        echo "  - WiFi drivers are not loaded"
        echo "  - Insufficient permissions"
    else
        for iface in "${interfaces[@]}"; do
            echo -e "${GREEN}  ✓ Found interface: $iface${RESET}"
            
            # Show current connection if available
            if command -v iwconfig >/dev/null 2>&1; then
                local essid
                essid=$(iwconfig "$iface" 2>/dev/null | grep -o 'ESSID:"[^"]*"' | cut -d'"' -f2)
                if [ -n "$essid" ] && [ "$essid" != "off/any" ]; then
                    echo -e "${CYAN}    Currently connected to: $essid${RESET}"
                fi
            fi
        done
    fi
    echo ""
}

# Run the checks
check_tools
check_permissions
show_interface_info

# Display menu
echo -e "${BLUE}Select an option:${RESET}"
echo "1) Run full WiFi vulnerability scanner"
echo "2) Run interactive demo"
echo "3) Run quick demo (brute force protection focus)"
echo "4) Test WiFi scanning tools"
echo "5) Show system information"
echo "6) Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "${BLUE}Starting full WiFi vulnerability scanner...${RESET}"
        npm start
        ;;
    2)
        echo -e "${BLUE}Starting interactive demo...${RESET}"
        npm run demo
        ;;
    3)
        echo -e "${BLUE}Starting quick demo...${RESET}"
        npm run quick-demo
        ;;
    4)
        echo -e "${BLUE}Testing WiFi scanning tools...${RESET}"
        test_wifi_tools
        ;;
    5)
        echo -e "${BLUE}System Information:${RESET}"
        show_system_info
        ;;
    6)
        echo -e "${BLUE}Goodbye!${RESET}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${RESET}"
        exit 1
        ;;
esac

# Test WiFi tools function
test_wifi_tools() {
    echo ""
    echo -e "${BLUE}Testing WiFi scanning capabilities...${RESET}"
    echo ""
    
    # Test iwlist
    if command -v iwlist >/dev/null 2>&1; then
        echo -e "${CYAN}Testing iwlist...${RESET}"
        # Find first wireless interface
        local iface
        if [ -f /proc/net/wireless ]; then
            iface=$(awk 'NR>2 {print $1}' /proc/net/wireless | head -1 | tr -d ':')
        fi
        
        if [ -n "$iface" ]; then
            echo "  Interface: $iface"
            if iwlist "$iface" scan 2>/dev/null | head -20; then
                echo -e "${GREEN}  ✓ iwlist scan working${RESET}"
            else
                echo -e "${YELLOW}  ⚠️  iwlist scan failed (may need sudo)${RESET}"
            fi
        else
            echo -e "${YELLOW}  ⚠️  No wireless interface found for iwlist${RESET}"
        fi
        echo ""
    fi
    
    # Test nmcli
    if command -v nmcli >/dev/null 2>&1; then
        echo -e "${CYAN}Testing nmcli...${RESET}"
        if nmcli device wifi list 2>/dev/null | head -10; then
            echo -e "${GREEN}  ✓ nmcli scan working${RESET}"
        else
            echo -e "${YELLOW}  ⚠️  nmcli scan failed${RESET}"
        fi
        echo ""
    fi
    
    # Test iw
    if command -v iw >/dev/null 2>&1; then
        echo -e "${CYAN}Testing iw...${RESET}"
        local iface
        iface=$(iw dev 2>/dev/null | awk '/Interface/ {print $2}' | head -1)
        
        if [ -n "$iface" ]; then
            echo "  Interface: $iface"
            if iw dev "$iface" scan 2>/dev/null | head -20; then
                echo -e "${GREEN}  ✓ iw scan working${RESET}"
            else
                echo -e "${YELLOW}  ⚠️  iw scan failed (may need sudo)${RESET}"
            fi
        else
            echo -e "${YELLOW}  ⚠️  No wireless interface found for iw${RESET}"
        fi
        echo ""
    fi
}

# Show system information
show_system_info() {
    echo ""
    echo -e "${CYAN}Linux System Information:${RESET}"
    echo "  Distribution: $(get_distro)"
    echo "  Kernel: $(uname -r)"
    echo "  Architecture: $(uname -m)"
    echo "  User: $(whoami)"
    
    if [ "$(id -u)" = "0" ]; then
        echo "  Privileges: Root"
    else
        echo "  Privileges: Regular user"
    fi
    
    echo ""
    echo -e "${CYAN}Available WiFi Tools:${RESET}"
    
    if command -v iwlist >/dev/null 2>&1; then
        echo "  ✓ iwlist (wireless-tools)"
    else
        echo "  ✗ iwlist (wireless-tools) - not installed"
    fi
    
    if command -v nmcli >/dev/null 2>&1; then
        echo "  ✓ nmcli (NetworkManager)"
    else
        echo "  ✗ nmcli (NetworkManager) - not installed"
    fi
    
    if command -v iw >/dev/null 2>&1; then
        echo "  ✓ iw"
    else
        echo "  ✗ iw - not installed"
    fi
    
    echo ""
}

# Keep terminal open after execution
echo ""
echo -e "${GREEN}Operation completed!${RESET}"
read -p "Press any key to exit..." -n 1 -r

exit 0
