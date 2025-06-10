# WiFi Vulnerability Scanner

## Overview
The WiFi Vulnerability Scanner is an educational tool designed to scan WiFi networks for potential vulnerabilities. It provides users with insights into the security of their networks and offers recommendations for improving security.

> **⚠️ DISCLAIMER**: This tool is for educational purposes only. Only use it on networks you own or have explicit permission to test. Unauthorized network scanning may be illegal in many jurisdictions.

## Features
- Scans available WiFi networks and identifies vulnerabilities
- Detects weak encryption protocols (WEP, unsecured networks)
- Identifies brute force protection vulnerabilities
- Tests for common default credentials
- Checks for outdated firmware with known security issues
- Analyzes router configuration for security gaps
- Provides detailed reports with security scores
- Offers actionable recommendations to improve security
- Supports macOS and Linux (mobile support planned)

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm (v6 or higher)
- macOS or Linux operating system
- Administrator privileges (required for scanning)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/wifi-vulnerability-scanner.git
cd wifi-vulnerability-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Prepare permissions (macOS):
```bash
sudo ln -sf /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport
```

## Usage

### Local Usage
Run the scanner from the project directory:

```bash
# Basic scan
npm start

# Interactive demo
npm run demo

# Quick demo focusing on brute force protection
npm run quick-demo
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