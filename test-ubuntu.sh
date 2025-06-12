#!/usr/bin/env bash
# Ubuntu WiFi Scanner Test Script
# Comprehensive testing script for Ubuntu Linux

# Text colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
RESET="\033[0m"

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Logging
LOG_FILE="ubuntu-test-results.log"
echo "Ubuntu WiFi Scanner Test - $(date)" > "$LOG_FILE"

# Helper function to run tests
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    ((TESTS_TOTAL++))
    echo -e "${BLUE}Running test: $test_name${RESET}"
    echo "Test: $test_name" >> "$LOG_FILE"
    
    if eval "$test_command" >> "$LOG_FILE" 2>&1; then
        if [[ "$expected_result" == "success" ]]; then
            echo -e "${GREEN}✓ PASSED: $test_name${RESET}"
            echo "RESULT: PASSED" >> "$LOG_FILE"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ FAILED: $test_name (expected failure but succeeded)${RESET}"
            echo "RESULT: FAILED (unexpected success)" >> "$LOG_FILE"
            ((TESTS_FAILED++))
        fi
    else
        if [[ "$expected_result" == "fail" ]]; then
            echo -e "${GREEN}✓ PASSED: $test_name (expected failure)${RESET}"
            echo "RESULT: PASSED (expected failure)" >> "$LOG_FILE"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ FAILED: $test_name${RESET}"
            echo "RESULT: FAILED" >> "$LOG_FILE"
            ((TESTS_FAILED++))
        fi
    fi
    echo "---" >> "$LOG_FILE"
}

# Header
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║           Ubuntu WiFi Scanner Test Suite              ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo ""

# System information
echo -e "${BLUE}Gathering system information...${RESET}"
echo "System Information:" >> "$LOG_FILE"
lsb_release -a >> "$LOG_FILE" 2>&1
uname -a >> "$LOG_FILE"
whoami >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

echo "Ubuntu Version: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "User: $(whoami)"
echo ""

# Test 1: Check if running on Ubuntu
echo -e "${YELLOW}=== System Compatibility Tests ===${RESET}"
run_test "Ubuntu Detection" "lsb_release -i | grep -i ubuntu" "success"

# Test 2: Node.js availability
echo -e "${YELLOW}=== Dependency Tests ===${RESET}"
run_test "Node.js Installation" "node --version" "success"
run_test "NPM Installation" "npm --version" "success"

# Test 3: WiFi tools availability
run_test "iwlist Tool" "which iwlist" "success"
run_test "nmcli Tool" "which nmcli" "success"
run_test "iw Tool" "which iw" "success"
run_test "NetworkManager Service" "systemctl is-active NetworkManager" "success"

# Test 4: WiFi interface detection
echo -e "${YELLOW}=== WiFi Interface Tests ===${RESET}"
run_test "WiFi Interface Detection" "iwconfig 2>/dev/null | grep -E '(wlan|wlp)'" "success"
run_test "Network Interfaces List" "ip link show | grep -E '(wlan|wlp)'" "success"

# Test 5: Basic WiFi scanning (requires WiFi to be enabled)
echo -e "${YELLOW}=== WiFi Scanning Tests ===${RESET}"
echo -e "${CYAN}Note: These tests require WiFi to be enabled and may need sudo${RESET}"

# Find WiFi interface
WIFI_INTERFACE=$(iwconfig 2>/dev/null | grep -E '(wlan|wlp)' | cut -d' ' -f1 | head -1)
if [[ -n "$WIFI_INTERFACE" ]]; then
    echo "Detected WiFi interface: $WIFI_INTERFACE"
    run_test "iwlist Scan Test" "timeout 30 iwlist $WIFI_INTERFACE scan | grep -i essid | head -1" "success"
    run_test "nmcli Scan Test" "timeout 30 nmcli device wifi list | head -5" "success"
else
    echo -e "${YELLOW}No WiFi interface detected, skipping scan tests${RESET}"
fi

# Test 6: Project structure and files
echo -e "${YELLOW}=== Project Structure Tests ===${RESET}"
run_test "Package.json exists" "test -f package.json" "success"
run_test "Source directory exists" "test -d src" "success"
run_test "Linux adapter exists" "test -f src/platforms/linux/adapter.js" "success"
run_test "Linux system-calls exists" "test -f src/platforms/linux/system-calls.js" "success"
run_test "Linux launcher script exists" "test -f bin/wifi-scanner-linux.sh" "success"

# Test 7: NPM dependencies
echo -e "${YELLOW}=== NPM Dependencies Tests ===${RESET}"
run_test "Node Modules Installation" "test -d node_modules" "success"
run_test "NPM Dependencies Check" "npm list --depth=0" "success"

# Test 8: Platform detection
echo -e "${YELLOW}=== Platform Detection Tests ===${RESET}"
if [[ -f test-platform.js ]]; then
    run_test "Platform Detection Script" "node test-platform.js | grep -i linux" "success"
else
    echo -e "${YELLOW}Platform test script not found, skipping${RESET}"
fi

# Test 9: Basic scanner functionality (non-interactive)
echo -e "${YELLOW}=== Scanner Functionality Tests ===${RESET}"
run_test "Quick Demo Execution" "timeout 60 node quick-demo.js | grep -i 'scanner'" "success"

# Test 10: Linux-specific launcher
echo -e "${YELLOW}=== Linux Launcher Tests ===${RESET}"
if [[ -f bin/wifi-scanner-linux.sh ]]; then
    run_test "Linux Launcher Script Executable" "test -x bin/wifi-scanner-linux.sh" "success"
    run_test "Linux Launcher Help" "timeout 30 echo 'q' | bin/wifi-scanner-linux.sh | grep -i 'wifi'" "success"
else
    echo -e "${YELLOW}Linux launcher script not found${RESET}"
fi

# Test 11: Permissions and groups
echo -e "${YELLOW}=== Permissions Tests ===${RESET}"
run_test "User in netdev group" "groups | grep netdev" "success"
run_test "Sudo access available" "sudo -n true 2>/dev/null || sudo -v" "success"

# Test 12: Advanced WiFi tool tests (if available)
echo -e "${YELLOW}=== Advanced Tool Tests ===${RESET}"
if [[ -n "$WIFI_INTERFACE" ]]; then
    run_test "WiFi Interface Status" "iwconfig $WIFI_INTERFACE | grep -i 'ieee'" "success"
    run_test "Interface Statistics" "cat /proc/net/dev | grep $WIFI_INTERFACE" "success"
fi

# Results summary
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗"
echo -e "║                    TEST RESULTS                       ║"
echo -e "╚═══════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "Total Tests: ${BLUE}$TESTS_TOTAL${RESET}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${RESET}"
echo -e "Failed: ${RED}$TESTS_FAILED${RESET}"

# Calculate success rate
if [[ $TESTS_TOTAL -gt 0 ]]; then
    SUCCESS_RATE=$(( (TESTS_PASSED * 100) / TESTS_TOTAL ))
    echo -e "Success Rate: ${CYAN}$SUCCESS_RATE%${RESET}"
else
    SUCCESS_RATE=0
fi

echo ""
echo "Detailed results saved to: $LOG_FILE"

# Recommendations based on results
echo ""
echo -e "${YELLOW}=== Recommendations ===${RESET}"

if [[ $TESTS_FAILED -gt 0 ]]; then
    echo -e "${RED}Some tests failed. Common solutions:${RESET}"
    echo "1. Install missing packages: sudo apt install wireless-tools iw network-manager nodejs npm"
    echo "2. Add user to netdev group: sudo usermod -a -G netdev \$USER"
    echo "3. Enable NetworkManager: sudo systemctl enable --now NetworkManager"
    echo "4. Install project dependencies: npm install"
    echo "5. Run with sudo if permission errors persist"
    echo ""
fi

if [[ $SUCCESS_RATE -ge 80 ]]; then
    echo -e "${GREEN}✓ System is ready for WiFi vulnerability scanner testing!${RESET}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./bin/wifi-scanner-linux.sh"
    echo "2. Or run: npm run demo"
    echo "3. Or run: node quick-demo.js"
elif [[ $SUCCESS_RATE -ge 60 ]]; then
    echo -e "${YELLOW}⚠ System is mostly ready but has some issues${RESET}"
    echo "Check the failed tests and install missing dependencies"
else
    echo -e "${RED}✗ System needs significant setup before testing${RESET}"
    echo "Please run ./setup.sh or manually install dependencies"
fi

echo ""
echo -e "${BLUE}For detailed Ubuntu testing instructions, see: docs/UBUNTU_TESTING.md${RESET}"

# Exit with appropriate code
if [[ $TESTS_FAILED -eq 0 ]]; then
    exit 0
else
    exit 1
fi
