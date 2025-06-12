npm run ubuntu-demo# WiFi Vulnerability Scanner

## Overview
The WiFi Vulnerability Scanner is an educational tool designed to scan WiFi networks for potential vulnerabilities. It provides users with insights into the security of their networks and offers recommendations for improving security.

> **⚠️ DISCLAIMER**: This tool is for educational purposes only. Only use it on networks you own or have explicit permission to test. Unauthorized network scanning may be illegal in many jurisdictions.

## Features
- **Educational WiFi Scanning**: Safe, cross-platform network discovery and analysis
- **Brute Force Protection Assessment**: Comprehensive password security evaluation
- **Advanced Security Testing**: Python + aircrack-ng integration for professional testing (Linux only)
- **Cross-Platform Support**: Works on macOS, Linux, and Windows
- **Intelligent Password Analysis**: Enhanced password complexity and common password detection
- **Legal Compliance Framework**: Built-in safeguards and consent mechanisms
- **Professional Integration**: Bridge between educational and advanced security testing
- **Comprehensive Documentation**: Complete guides for all skill levels
- **Automated Testing**: Integration test suite for validation
- **Ubuntu Optimization**: Specialized Linux support with multiple WiFi tools

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm (v6 or higher)
- Linux (Ubuntu 18.04+), macOS, or compatible system
- Administrator privileges (may be required for some scanning operations)

### Automated Setup
Run the setup script for your platform:
```bash
./setup.sh
```

### Manual Setup

#### Ubuntu/Debian Linux
```bash
# Install system dependencies
sudo apt update
sudo apt install -y nodejs npm wireless-tools iw network-manager

# Clone and install
git clone https://github.com/yourusername/wifi-vulnerability-scanner.git
cd wifi-vulnerability-scanner
npm install

# Add user to netdev group for network access
sudo usermod -a -G netdev $USER
```

#### macOS
```bash
# Install dependencies
brew install node

# Clone and install
git clone https://github.com/yourusername/wifi-vulnerability-scanner.git
cd wifi-vulnerability-scanner
npm install

# Set up airport utility
sudo ln -sf /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport
```

## Usage

### Educational Mode (All Platforms)
```bash
# Basic WiFi scanning and analysis
npm start

# Interactive educational demo
npm run demo

# Quick demo focusing on brute force protection
npm run quick-demo

# Enhanced brute force protection demonstration
npm run bruteforce-demo

# Ubuntu-specific features (Linux)
npm run ubuntu-demo
```

### Advanced Integration Mode
```bash
# Advanced WiFi security testing demonstration
npm run advanced-demo

# Python-Node.js integration testing
npm run integration-test

# Linux-specific advanced features (requires aircrack-ng)
sudo python3 wifi_bruteforce_enhanced.py --integration
```

### Home Directory Setup
Set up a convenient launcher in your home directory:

```bash
# From the project directory
./bin/install-home.sh
```

After installation, you can use:
```bash
# Run menu from home directory
~/wifi-scanner.sh

# Use aliases (after opening a new terminal or sourcing ~/.zshrc)
wifi-scan   # Launch menu
wifi-demo   # Run interactive demo
wifi-quick  # Run quick demo
```

### Global Installation
Install the scanner globally to run it from anywhere:

```bash
# Install globally
cd wifi-vulnerability-scanner
./bin/install-global.sh
```

Once installed, you can use these commands from anywhere:

```bash
# Launch with interactive menu
wifi-scanner

# Launch specific modes
wifi-scanner start    # Full scanner
wifi-scanner demo     # Interactive demo
wifi-scanner quick    # Quick demo
wifi-scanner help     # Show help
```

### One-Line Installation
Install directly from the internet with one command:

```bash
# Install directly from GitHub
curl -fsSL https://example.com/wifi-scanner-installer.sh | zsh
```

This will clone the repository, install dependencies, and set up the home directory launcher.

### macOS Users
For a more native experience on macOS:

```bash
./bin/wifi-scanner-macos.sh
```

This will display a macOS dialog for selecting the scanner mode.

### Interactive Demo
The interactive demo guides you through:
1. Scanning for available networks
2. Selecting a network for assessment
3. Evaluating different password scenarios for educational purposes
4. Viewing a comprehensive security report with educational content

### Quick Demo
The quick demo automatically:
```

This will automatically:
1. Scan for available networks
2. Select the first network
3. Test various password scenarios to show how complexity affects security
4. Display educational content about WiFi security

This will:
1. Scan for available WiFi networks
2. List detected networks
3. Select your current network for assessment
4. Perform security tests
5. Generate a comprehensive security report

### Advanced Usage
```bash
# Run with debug logging
DEBUG=true npm start

# Save scan results to file
npm start -- --output scan-results.json

# Scan a specific network (if in range)
npm start -- --ssid "YourNetworkName"
```

## Python Integration

### Advanced WiFi Security Testing
The scanner now includes integration with Python-based aircrack-ng tools for professional security testing:

```bash
# Check system compatibility for advanced testing
python3 wifi_bruteforce_enhanced.py --check-only --integration

# Advanced testing demonstration (Linux + root required)
sudo npm run advanced-demo

# Direct advanced testing (experienced users only)
sudo python3 wifi_bruteforce_enhanced.py
```

### Python Dependencies
```bash
# Install Python requirements
pip3 install -r requirements.txt

# Essential dependencies
pip3 install colorama psutil netifaces
```

### Linux Advanced Features
On Linux systems with aircrack-ng installed:
- **Monitor Mode WiFi**: Real wireless interface monitoring
- **WPA Handshake Capture**: Professional security assessment
- **Dictionary Attacks**: Password security testing
- **Professional Reporting**: Detailed security analysis

> **⚠️ LEGAL WARNING**: Advanced features are for authorized security testing only. Only use on networks you own or have explicit written permission to test.

## Security Aspects Analyzed

| Feature | Description | Risk Level |
|---------|-------------|------------|
| Encryption Type | Detects WEP, WPA, WPA2, WPA3 or open networks | Critical |
| Brute Force Protection | Checks if network restricts repeated login attempts | High |
| Default Credentials | Tests for factory default router passwords | Critical |
| Firmware Status | Checks if router firmware is outdated | Medium |
| WPS Vulnerabilities | Identifies WPS security issues | High |
| Signal Propagation | Determines if signal extends beyond premises | Low |
| Open Ports | Scans for unnecessary exposed ports | Medium |
| DNS Security | Verifies DNS settings for hijacking risks | Medium |

## Project Structure
```
wifi-vulnerability-scanner
├── src
│   ├── core
│   ├── platforms
│   ├── ui
│   └── utils
├── docs
├── tests
├── app.json
├── package.json
├── babel.config.js
├── metro.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)
- React Native development environment set up for mobile platforms

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd wifi-vulnerability-scanner
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application
- For macOS:
  ```
  npm run start:macos
  ```

- For Android:
  ```
  npm run start:android
  ```

- For iOS:
  ```
  npm run start:ios
  ```

### Usage
1. Launch the application.
2. Navigate to the Scan screen to initiate a WiFi scan.
3. Review the results on the Results screen.
4. Check the Vulnerabilities screen for identified issues and recommended actions.

## Documentation
Refer to the `docs` folder for detailed documentation on architecture, tutorials, and WiFi security best practices.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.