# Ubuntu Testing Instructions

## Quick Start for Ubuntu Testing

Since you have a ready Ubuntu OS, here's how to test the WiFi vulnerability scanner:

### 1. Transfer the Project to Ubuntu

**Option A: Using Git (Recommended)**
```bash
# On Ubuntu system
git clone <your-repo-url>
cd wifi-vulnerability-scanner
```

**Option B: Transfer files directly**
```bash
# Copy the entire project directory to your Ubuntu system
scp -r /Users/phenix/Projects/wifi_checker/wifi-vulnerability-scanner user@ubuntu-ip:~/
```

### 2. Run the Automated Setup

```bash
# On Ubuntu system
cd wifi-vulnerability-scanner
chmod +x setup.sh
./setup.sh
```

### 3. Quick Validation Test

```bash
# Run the Ubuntu-specific test suite
chmod +x test-ubuntu.sh
./test-ubuntu.sh
```

### 4. Run the Ubuntu Demo

```bash
# Run the Ubuntu-specific demo
npm run ubuntu-demo
```

### 5. Test Main Functionality

```bash
# Test the full interactive demo
npm run demo

# Test the quick non-interactive demo
npm run quick-demo

# Test the Linux-specific launcher
./bin/wifi-scanner-linux.sh
```

## Expected Results

### System Requirements Check
- ✅ Ubuntu 18.04+ detected
- ✅ Node.js and npm installed
- ✅ WiFi tools available (iwlist, nmcli, iw)
- ✅ NetworkManager service running
- ✅ WiFi interface detected

### WiFi Scanning Tests
- ✅ Multiple scanning methods working (iwlist, nmcli, iw)
- ✅ Network interface detection successful
- ✅ WiFi networks discovered and parsed
- ✅ Security analysis functioning

### Demo Functionality
- ✅ Platform detection working (should detect Linux)
- ✅ Educational content displaying properly
- ✅ Brute force protection simulation working
- ✅ Security recommendations provided

## Troubleshooting Common Issues

### Issue: "No wireless interface found"
```bash
# Check WiFi status
sudo systemctl status NetworkManager
iwconfig
ip link show | grep -E "(wlan|wlp)"

# Enable WiFi if disabled
sudo systemctl enable --now NetworkManager
nmcli radio wifi on
```

### Issue: "Permission denied" for scanning
```bash
# Add user to netdev group
sudo usermod -a -G netdev $USER
# Log out and back in, or run:
newgrp netdev

# Or run with sudo for testing
sudo npm run ubuntu-demo
```

### Issue: "Command not found" for WiFi tools
```bash
# Install missing tools
sudo apt update
sudo apt install -y wireless-tools iw network-manager nodejs npm

# Verify installation
which iwlist nmcli iw node npm
```

### Issue: "No networks found"
```bash
# Ensure WiFi is enabled and scan manually
nmcli device wifi rescan
nmcli device wifi list
iwlist scan | grep ESSID
```

## Advanced Testing

### Test Different WiFi Tools Individually

```bash
# Test iwlist
sudo iwlist wlan0 scan | head -20

# Test nmcli
nmcli device wifi rescan
nmcli device wifi list

# Test iw
sudo iw dev wlan0 scan trigger
sudo iw dev wlan0 scan | head -20
```

### Test Scanner Components

```bash
# Test platform detection
node test-platform.js

# Test core scanner
node -e "const scanner = require('./src/core/scanner'); scanner.scanNetworks().then(console.log)"

# Test Linux adapter directly
node -e "const adapter = require('./src/platforms/linux/adapter'); adapter.scanNetworks().then(console.log)"
```

### Performance Testing

```bash
# Time the scanning process
time npm run ubuntu-demo

# Test with debug output
DEBUG=* npm run demo
```

## What to Look For

### Successful Indicators
- Platform correctly detected as "Linux"
- Multiple WiFi scanning tools detected and working
- WiFi networks discovered and displayed with proper details
- Security analysis providing educational insights
- No permission errors (with proper setup)
- Colorful terminal output with clear formatting

### Educational Features Working
- Password complexity demonstrations
- Brute force protection simulations
- Security vulnerability explanations
- Network encryption analysis
- Actionable security recommendations

## Reporting Results

When testing is complete, please report:

1. **System Info**: Ubuntu version, WiFi adapter type
2. **Test Results**: Output from `./test-ubuntu.sh`
3. **Demo Results**: Screenshots or logs from `npm run ubuntu-demo`
4. **Any Issues**: Error messages, failed tests, missing features
5. **Performance**: Speed of network scanning and analysis

## Ready-to-Run Test Commands

Here are the key commands to run on your Ubuntu system:

```bash
# Complete test sequence
cd wifi-vulnerability-scanner
./setup.sh                    # Setup dependencies
./test-ubuntu.sh              # Comprehensive testing
npm run ubuntu-demo           # Ubuntu-specific demo
npm run demo                  # Full interactive demo
npm run quick-demo            # Quick non-interactive demo
./bin/wifi-scanner-linux.sh   # Linux launcher
```

This should give you a complete validation of the Linux implementation on your Ubuntu system!
