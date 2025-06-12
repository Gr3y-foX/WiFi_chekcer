# Ubuntu Testing Guide

This guide provides instructions for testing the WiFi Vulnerability Scanner on Ubuntu Linux.

## Prerequisites

- Ubuntu 18.04+ (tested on Ubuntu 20.04, 22.04, and 24.04)
- WiFi adapter/interface available
- Internet connection for package installation

## Quick Setup

### 1. Install Dependencies

Run the automated setup script:
```bash
./setup.sh
```

Or manually install dependencies:
```bash
# Update package lists
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install WiFi scanning tools
sudo apt install -y wireless-tools iw network-manager

# Install additional utilities
sudo apt install -y nmap net-tools curl wget git

# Add user to netdev group for network access
sudo usermod -a -G netdev $USER
```

### 2. Install Project Dependencies

```bash
npm install
```

## Testing the Scanner

### Method 1: Using the Linux Launcher Script

```bash
# Make the script executable
chmod +x bin/wifi-scanner-linux.sh

# Run the Linux-specific launcher
./bin/wifi-scanner-linux.sh
```

### Method 2: Direct Node.js Execution

```bash
# Run the interactive demo
npm run demo

# Run the quick demo (non-interactive)
npm run quick-demo

# Run the main application
npm start
```

### Method 3: Testing Platform Detection

```bash
# Test platform detection
node test-platform.js
```

## What to Test

### 1. WiFi Tool Detection
The scanner should automatically detect and use available WiFi tools:
- **iwlist** (wireless-tools) - Primary scanning method
- **nmcli** (NetworkManager) - Secondary scanning method  
- **iw** (iw package) - Tertiary scanning method

### 2. Network Interface Detection
Test that the scanner can find your WiFi interface:
```bash
# Check available interfaces manually
iwconfig
# or
ip link show
# or
nmcli device status
```

### 3. WiFi Scanning
Test actual network scanning:
```bash
# Manual scan tests
iwlist scan | head -20
nmcli device wifi list
iw dev wlan0 scan | head -20
```

### 4. Privilege Requirements
Some operations may require elevated privileges:
```bash
# Test with sudo if needed
sudo node demo.js
```

## Expected Behavior

### Successful Test Outputs

1. **Tool Detection**: Scanner should find at least one WiFi tool
2. **Interface Detection**: Should identify your WiFi interface (usually wlan0, wlp2s0, etc.)
3. **Network Scanning**: Should detect nearby WiFi networks
4. **Security Assessment**: Should analyze detected networks and provide recommendations

### Common Issues and Solutions

#### Issue: "No wireless interface found"
**Solution**: 
```bash
# Check if WiFi is enabled
sudo systemctl status NetworkManager
sudo systemctl start NetworkManager

# Check available interfaces
ip link show
```

#### Issue: "Permission denied" errors
**Solution**:
```bash
# Run with sudo
sudo node demo.js

# Or add user to netdev group and reboot
sudo usermod -a -G netdev $USER
sudo reboot
```

#### Issue: "No compatible WiFi scanning tools found"
**Solution**:
```bash
# Install missing tools
sudo apt install -y wireless-tools iw network-manager
```

#### Issue: WiFi adapter not detected
**Solution**:
```bash
# Check if WiFi hardware is detected
lspci | grep -i wifi
lsusb | grep -i wifi

# Check driver status
lsmod | grep -i wifi
dmesg | grep -i wifi
```

## Advanced Testing

### Test Multiple Scanning Methods

```bash
# Test iwlist directly
iwlist scan

# Test nmcli directly  
nmcli device wifi rescan
nmcli device wifi list

# Test iw directly
sudo iw dev wlan0 scan trigger
sudo iw dev wlan0 scan
```

### Test Network Analysis Features

The scanner provides educational demonstrations of:
- Password complexity analysis
- Brute force protection simulation
- Security vulnerability assessment
- Network encryption analysis

### Performance Testing

```bash
# Test scan speed and accuracy
time node quick-demo.js

# Test with verbose logging
DEBUG=* node demo.js
```

## Reporting Issues

When reporting issues, please include:

1. Ubuntu version: `lsb_release -a`
2. Node.js version: `node -v`
3. WiFi interface info: `iwconfig`
4. Available tools: `which iwlist nmcli iw`
5. Error logs from the scanner
6. Output of: `sudo journalctl -u NetworkManager --since "1 hour ago"`

## Security Notes

- This tool is for educational purposes only
- Only test on networks you own or have permission to test
- Some features require elevated privileges for demonstration purposes
- The tool demonstrates vulnerabilities but does not perform actual attacks
- All "brute force" demonstrations use simulated/mock data

## Contributing

If you find Ubuntu-specific issues or improvements, please contribute:
1. Test thoroughly on your Ubuntu version
2. Document any version-specific quirks
3. Submit pull requests with fixes
4. Update this testing guide with new findings
