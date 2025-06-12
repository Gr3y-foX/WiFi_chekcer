#!/usr/bin/env bash
# Ubuntu WiFi Scanner - Quick Validation Script
# Run this on your Ubuntu system to validate the scanner is working

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════╗"
echo -e "║         Ubuntu WiFi Scanner - Quick Validation      ║"
echo -e "╚══════════════════════════════════════════════════════╝${RESET}"
echo ""

# Check if we're on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
    echo -e "${YELLOW}⚠ Warning: This doesn't appear to be Ubuntu${RESET}"
    echo "Detected system: $(lsb_release -d 2>/dev/null | cut -f2 || echo 'Unknown')"
    echo ""
fi

# Quick system check
echo -e "${BLUE}1. System Check${RESET}"
echo "OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo 'Unknown Linux')"
echo "User: $(whoami)"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "NPM: $(npm --version 2>/dev/null || echo 'Not installed')"
echo ""

# Check WiFi tools
echo -e "${BLUE}2. WiFi Tools Check${RESET}"
tools=("iwlist" "nmcli" "iw" "iwconfig")
for tool in "${tools[@]}"; do
    if command -v "$tool" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${RESET} $tool - Available"
    else
        echo -e "${RED}✗${RESET} $tool - Missing"
    fi
done
echo ""

# Check WiFi interface
echo -e "${BLUE}3. WiFi Interface Check${RESET}"
wifi_interface=$(iwconfig 2>/dev/null | grep -E "(wlan|wlp)" | cut -d' ' -f1 | head -1)
if [ -n "$wifi_interface" ]; then
    echo -e "${GREEN}✓${RESET} Found WiFi interface: $wifi_interface"
    
    # Check if interface is up
    if ip link show "$wifi_interface" | grep -q "UP"; then
        echo -e "${GREEN}✓${RESET} Interface is UP"
    else
        echo -e "${YELLOW}⚠${RESET} Interface is DOWN"
    fi
else
    echo -e "${RED}✗${RESET} No WiFi interface found"
fi
echo ""

# Check NetworkManager
echo -e "${BLUE}4. NetworkManager Check${RESET}"
if systemctl is-active --quiet NetworkManager 2>/dev/null; then
    echo -e "${GREEN}✓${RESET} NetworkManager is active"
else
    echo -e "${YELLOW}⚠${RESET} NetworkManager is not active"
fi
echo ""

# Check project files
echo -e "${BLUE}5. Project Files Check${RESET}"
required_files=(
    "package.json"
    "src/platforms/linux/adapter.js"
    "src/platforms/linux/system-calls.js"
    "bin/wifi-scanner-linux.sh"
    "ubuntu-demo.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${RESET} $file"
    else
        echo -e "${RED}✗${RESET} $file - Missing"
    fi
done
echo ""

# Check node_modules
echo -e "${BLUE}6. Dependencies Check${RESET}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${RESET} node_modules directory exists"
    
    # Check key dependencies
    key_deps=("chalk" "inquirer")
    for dep in "${key_deps[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "${GREEN}✓${RESET} $dep installed"
        else
            echo -e "${YELLOW}⚠${RESET} $dep missing"
        fi
    done
else
    echo -e "${RED}✗${RESET} node_modules directory missing"
    echo -e "${YELLOW}Run: npm install${RESET}"
fi
echo ""

# Test basic WiFi scan
echo -e "${BLUE}7. Basic WiFi Scan Test${RESET}"
if [ -n "$wifi_interface" ]; then
    echo "Testing basic WiFi scanning..."
    
    # Test nmcli (usually works without sudo)
    if command -v nmcli >/dev/null 2>&1; then
        echo -n "nmcli scan: "
        if timeout 15 nmcli device wifi list >/dev/null 2>&1; then
            echo -e "${GREEN}Working${RESET}"
        else
            echo -e "${YELLOW}Limited/Failed${RESET}"
        fi
    fi
    
    # Test iwlist (may need sudo)
    if command -v iwlist >/dev/null 2>&1; then
        echo -n "iwlist scan: "
        if timeout 15 iwlist "$wifi_interface" scan >/dev/null 2>&1; then
            echo -e "${GREEN}Working${RESET}"
        elif timeout 15 sudo iwlist "$wifi_interface" scan >/dev/null 2>&1; then
            echo -e "${YELLOW}Working with sudo${RESET}"
        else
            echo -e "${RED}Failed${RESET}"
        fi
    fi
else
    echo -e "${YELLOW}Skipping - no WiFi interface detected${RESET}"
fi
echo ""

# Test scanner platform detection
echo -e "${BLUE}8. Scanner Platform Detection${RESET}"
if [ -f "test-platform.js" ]; then
    echo -n "Platform detection: "
    if node test-platform.js 2>/dev/null | grep -q "Linux"; then
        echo -e "${GREEN}Linux detected correctly${RESET}"
    else
        echo -e "${YELLOW}Unexpected result${RESET}"
    fi
else
    echo -e "${YELLOW}test-platform.js not found${RESET}"
fi
echo ""

# Final recommendations
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗"
echo -e "║                   Recommendations                    ║"
echo -e "╚══════════════════════════════════════════════════════╝${RESET}"
echo ""

# Check if ready to test
missing_deps=false
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}Install Node.js: sudo apt install nodejs npm${RESET}"
    missing_deps=true
fi

if ! command -v iwlist >/dev/null 2>&1 && ! command -v nmcli >/dev/null 2>&1; then
    echo -e "${RED}Install WiFi tools: sudo apt install wireless-tools network-manager${RESET}"
    missing_deps=true
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Install project dependencies: npm install${RESET}"
    missing_deps=true
fi

if [ -z "$wifi_interface" ]; then
    echo -e "${YELLOW}Enable WiFi: sudo systemctl start NetworkManager && nmcli radio wifi on${RESET}"
fi

if ! groups | grep -q netdev; then
    echo -e "${YELLOW}Add user to netdev group: sudo usermod -a -G netdev \$USER && logout${RESET}"
fi

if [ "$missing_deps" = false ]; then
    echo -e "${GREEN}🎉 System appears ready for testing!${RESET}"
    echo ""
    echo -e "${BLUE}Ready to run:${RESET}"
    echo "  npm run ubuntu-demo     # Ubuntu-specific demo"
    echo "  npm run demo           # Interactive demo"
    echo "  npm run quick-demo     # Quick demo"
    echo "  ./test-ubuntu.sh       # Comprehensive test suite"
else
    echo -e "${YELLOW}Please install missing dependencies first${RESET}"
fi

echo ""
echo -e "${CYAN}For detailed instructions, see: docs/UBUNTU_QUICK_START.md${RESET}"
