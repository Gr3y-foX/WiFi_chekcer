#!/usr/bin/env node
/**
 * Ubuntu Linux WiFi Scanner Demo
 * 
 * This script demonstrates the WiFi vulnerability scanner's Linux-specific capabilities
 * optimized for Ubuntu systems.
 */

const chalk = require('chalk');
const os = require('os');

// Import platform detection
let linuxAdapter, linuxSystemCalls;
try {
    linuxAdapter = require('./src/platforms/linux/adapter');
    linuxSystemCalls = require('./src/platforms/linux/system-calls');
} catch (error) {
    console.error('Error loading Linux modules:', error.message);
    process.exit(1);
}

/**
 * Display Ubuntu-specific header
 */
function displayUbuntuHeader() {
    console.log(chalk.cyan('╔══════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║          WiFi Scanner - Ubuntu Linux Demo           ║'));
    console.log(chalk.cyan('╚══════════════════════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.yellow('Educational WiFi vulnerability scanner for Ubuntu Linux'));
    console.log(chalk.gray('Use only on networks you own or have permission to test'));
    console.log('');
}

/**
 * Display system information
 */
async function displaySystemInfo() {
    console.log(chalk.blue('📊 System Information'));
    console.log(chalk.gray('─'.repeat(50)));
    
    try {
        const systemInfo = await linuxSystemCalls.getSystemInfo();
        
        console.log(`${chalk.cyan('OS:')} ${systemInfo.os}`);
        console.log(`${chalk.cyan('Distribution:')} ${systemInfo.distribution}`);
        console.log(`${chalk.cyan('Kernel:')} ${systemInfo.kernel}`);
        console.log(`${chalk.cyan('Architecture:')} ${systemInfo.architecture}`);
        console.log(`${chalk.cyan('User:')} ${systemInfo.user}`);
        console.log(`${chalk.cyan('Privileges:')} ${systemInfo.privileges ? chalk.green('Root') : chalk.yellow('User')}`);
    } catch (error) {
        console.log(chalk.red('Could not gather system information:', error.message));
    }
    console.log('');
}

/**
 * Test WiFi tool availability
 */
async function testWifiTools() {
    console.log(chalk.blue('🔧 WiFi Tools Availability'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const tools = ['iwlist', 'nmcli', 'iw', 'iwconfig'];
    
    for (const tool of tools) {
        try {
            const available = await linuxSystemCalls.isCommandAvailable(tool);
            if (available) {
                console.log(`${chalk.green('✓')} ${tool} - Available`);
            } else {
                console.log(`${chalk.red('✗')} ${tool} - Not available`);
            }
        } catch (error) {
            console.log(`${chalk.red('✗')} ${tool} - Error checking availability`);
        }
    }
    console.log('');
}

/**
 * Test WiFi interface detection
 */
async function testWifiInterface() {
    console.log(chalk.blue('📡 WiFi Interface Detection'));
    console.log(chalk.gray('─'.repeat(50)));
    
    try {
        const interface = await linuxAdapter.getWirelessInterface();
        console.log(`${chalk.green('✓')} Found WiFi interface: ${chalk.cyan(interface)}`);
        
        // Get interface stats if available
        try {
            const stats = await linuxSystemCalls.getInterfaceStats(interface);
            if (stats && !stats.error) {
                console.log(`  ${chalk.gray('RX Bytes:')} ${stats.rxBytes}`);
                console.log(`  ${chalk.gray('TX Bytes:')} ${stats.txBytes}`);
                console.log(`  ${chalk.gray('RX Packets:')} ${stats.rxPackets}`);
                console.log(`  ${chalk.gray('TX Packets:')} ${stats.txPackets}`);
            }
        } catch (statsError) {
            console.log(`  ${chalk.yellow('Could not get interface statistics')}`);
        }
    } catch (error) {
        console.log(`${chalk.red('✗')} No WiFi interface found: ${error.message}`);
        console.log(chalk.yellow('  Try enabling WiFi or checking drivers'));
    }
    console.log('');
}

/**
 * Test network connectivity
 */
async function testConnectivity() {
    console.log(chalk.blue('🌐 Network Connectivity Test'));
    console.log(chalk.gray('─'.repeat(50)));
    
    try {
        const result = await linuxSystemCalls.testConnectivity('8.8.8.8', 3);
        
        if (result.success) {
            console.log(`${chalk.green('✓')} Internet connectivity: Working`);
            console.log(`  ${chalk.gray('Target:')} ${result.target}`);
            console.log(`  ${chalk.gray('Packet Loss:')} ${result.packetLoss}%`);
            console.log(`  ${chalk.gray('Average Time:')} ${result.averageTime}ms`);
        } else {
            console.log(`${chalk.red('✗')} Internet connectivity: Failed`);
            console.log(`  ${chalk.gray('Error:')} ${result.error}`);
        }
    } catch (error) {
        console.log(`${chalk.red('✗')} Connectivity test failed: ${error.message}`);
    }
    console.log('');
}

/**
 * Demonstrate WiFi scanning with different tools
 */
async function demonstrateScanning() {
    console.log(chalk.blue('🔍 WiFi Scanning Demonstration'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const scanMethods = [
        { name: 'iwlist', method: 'scanWithIwlist' },
        { name: 'nmcli', method: 'scanWithNmcli' },
        { name: 'iw', method: 'scanWithIw' }
    ];
    
    for (const scanMethod of scanMethods) {
        console.log(chalk.yellow(`Testing ${scanMethod.name} scanning...`));
        
        try {
            const networks = await linuxAdapter[scanMethod.method]();
            
            if (networks && networks.length > 0) {
                console.log(`${chalk.green('✓')} ${scanMethod.name}: Found ${networks.length} networks`);
                
                // Show first few networks as examples
                const displayCount = Math.min(3, networks.length);
                for (let i = 0; i < displayCount; i++) {
                    const network = networks[i];
                    const securityColor = 
                        network.encryption === 'WPA3' ? chalk.green :
                        network.encryption === 'WPA2' ? chalk.cyan :
                        network.encryption === 'WPA' ? chalk.yellow :
                        chalk.red;
                    
                    console.log(`  ${i + 1}. ${network.ssid || '(Hidden)'} - ${securityColor(network.encryption)} - ${network.signal_level}dBm`);
                }
                
                if (networks.length > displayCount) {
                    console.log(`  ... and ${networks.length - displayCount} more networks`);
                }
            } else {
                console.log(`${chalk.yellow('⚠')} ${scanMethod.name}: No networks found`);
            }
        } catch (error) {
            console.log(`${chalk.red('✗')} ${scanMethod.name}: ${error.message}`);
        }
        console.log('');
    }
}

/**
 * Show privilege requirements and recommendations
 */
function showPrivilegeInfo() {
    console.log(chalk.blue('🔐 Privilege Information'));
    console.log(chalk.gray('─'.repeat(50)));
    
    console.log('Some WiFi scanning operations may require elevated privileges:');
    console.log('');
    
    console.log(chalk.yellow('Normal user permissions:'));
    console.log('  ✓ Network Manager (nmcli) scanning');
    console.log('  ✓ Reading /proc/net/wireless');
    console.log('  ✓ Basic interface information');
    console.log('');
    
    console.log(chalk.cyan('Elevated permissions (sudo) may be required for:'));
    console.log('  • iwlist scanning on some systems');
    console.log('  • iw scanning and triggering');
    console.log('  • Detailed interface monitoring');
    console.log('  • Advanced network analysis');
    console.log('');
    
    console.log(chalk.gray('To run with elevated privileges:'));
    console.log(chalk.white('  sudo node ubuntu-demo.js'));
    console.log('');
}

/**
 * Main demo function
 */
async function runUbuntuDemo() {
    displayUbuntuHeader();
    
    // Check if running on Linux
    if (os.platform() !== 'linux') {
        console.log(chalk.red('⚠ This demo is designed for Linux systems'));
        console.log(chalk.yellow('You are running on:'), os.platform());
        console.log('For platform-independent testing, use: npm run demo');
        return;
    }
    
    try {
        // System information
        await displaySystemInfo();
        
        // Tool availability
        await testWifiTools();
        
        // Interface detection
        await testWifiInterface();
        
        // Connectivity test
        await testConnectivity();
        
        // WiFi scanning demonstration
        await demonstrateScanning();
        
        // Privilege information
        showPrivilegeInfo();
        
        console.log(chalk.green('✨ Ubuntu demo completed successfully!'));
        console.log('');
        console.log(chalk.blue('Next steps:'));
        console.log('  • Run the full interactive demo: npm run demo');
        console.log('  • Run the quick demo: npm run quick-demo');
        console.log('  • Use the Linux launcher: ./bin/wifi-scanner-linux.sh');
        console.log('  • Test with the Ubuntu test suite: ./test-ubuntu.sh');
        
    } catch (error) {
        console.error(chalk.red('Demo failed:'), error.message);
        console.log(chalk.yellow('\nTroubleshooting tips:'));
        console.log('1. Install dependencies: sudo apt install wireless-tools iw network-manager');
        console.log('2. Enable WiFi and NetworkManager');
        console.log('3. Run with sudo if permission errors persist');
        console.log('4. Check Ubuntu testing guide: docs/UBUNTU_TESTING.md');
    }
}

// Run the demo
runUbuntuDemo().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});
