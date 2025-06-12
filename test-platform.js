#!/usr/bin/env node
/**
 * Platform Detection Test Script
 * 
 * Tests the platform detection and adapter loading functionality
 */

const chalk = require('chalk');
const os = require('os');

async function testPlatformDetection() {
    console.log(chalk.blue('=== Platform Detection Test ===\n'));
    
    const platform = os.platform();
    console.log(`Current platform: ${chalk.cyan(platform)}`);
    
    try {
        // Test loading adapters
        console.log('\nTesting adapter loading...');
        
        if (platform === 'darwin') {
            console.log(chalk.yellow('Loading macOS adapter...'));
            const macosAdapter = require('./src/platforms/macos/adapter');
            console.log(chalk.green('✓ macOS adapter loaded successfully'));
            console.log(`Available functions: ${Object.keys(macosAdapter).join(', ')}`);
        }
        
        // Test Linux adapter regardless of platform (for testing)
        console.log(chalk.yellow('Loading Linux adapter (for testing)...'));
        const linuxAdapter = require('./src/platforms/linux/adapter');
        console.log(chalk.green('✓ Linux adapter loaded successfully'));
        console.log(`Available functions: ${Object.keys(linuxAdapter).join(', ')}`);
        
        // Test the updated scanner
        console.log(chalk.yellow('\nTesting updated scanner...'));
        const scanner = require('./src/core/scanner');
        console.log(chalk.green('✓ Scanner loaded successfully'));
        
        // Test network scanning
        console.log(chalk.cyan('\nTesting network scanning...'));
        const networks = await scanner.scanNetworks();
        console.log(chalk.green(`✓ Scan completed, found ${networks.length} networks`));
        
        // Display first few networks
        if (networks.length > 0) {
            console.log('\nSample networks:');
            networks.slice(0, 3).forEach((network, index) => {
                console.log(`${index + 1}. ${network.ssid} (${network.encryption || 'Unknown'})`);
            });
        }
        
    } catch (error) {
        console.error(chalk.red('Error during testing:'), error.message);
    }
}

// Check if we can test Linux-specific functionality
async function testLinuxSpecific() {
    console.log(chalk.blue('\n=== Linux Adapter Test ===\n'));
    
    try {
        const linuxAdapter = require('./src/platforms/linux/adapter');
        const linuxSystemCalls = require('./src/platforms/linux/system-calls');
        
        console.log('Testing Linux system calls...');
        
        // Test command availability check
        const isAvailable = await linuxSystemCalls.isCommandAvailable('echo');
        console.log(`echo command available: ${isAvailable ? chalk.green('✓') : chalk.red('✗')}`);
        
        // Test system info gathering
        console.log('Getting system info...');
        const systemInfo = await linuxSystemCalls.getSystemInfo();
        console.log('System info:', systemInfo);
        
        console.log(chalk.green('✓ Linux adapter testing completed'));
        
    } catch (error) {
        console.error(chalk.red('Linux adapter test failed:'), error.message);
    }
}

async function main() {
    await testPlatformDetection();
    await testLinuxSpecific();
    
    console.log(chalk.blue('\n=== Test Complete ==='));
}

main().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});
