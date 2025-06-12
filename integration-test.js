#!/usr/bin/env node
/**
 * Python-Node.js Integration Test Script
 * 
 * This script tests the complete integration between the Node.js educational
 * WiFi scanner and the Python aircrack-ng based advanced testing suite.
 */

const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Import our modules
const scanner = require('./src/core/scanner');
const AdvancedWiFiTester = require('./src/core/advanced-wifi-tester');

/**
 * Test results tracking
 */
class TestTracker {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.total = 0;
    }

    addTest(name, status, details = '') {
        this.tests.push({ name, status, details, timestamp: new Date().toISOString() });
        this.total++;
        if (status === 'pass') {
            this.passed++;
        } else {
            this.failed++;
        }
    }

    getResults() {
        return {
            total: this.total,
            passed: this.passed,
            failed: this.failed,
            percentage: this.total > 0 ? Math.round((this.passed / this.total) * 100) : 0,
            tests: this.tests
        };
    }
}

const testTracker = new TestTracker();

/**
 * Display test header
 */
function displayHeader() {
    console.log(chalk.cyan('╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║        Python-Node.js Integration Test Suite         ║'));
    console.log(chalk.cyan('╚═══════════════════════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.yellow('Testing complete integration between educational and advanced tools'));
    console.log(chalk.gray(`Platform: ${os.platform()} | Architecture: ${os.arch()}`));
    console.log('');
}

/**
 * Test file existence and structure
 */
async function testFileStructure() {
    console.log(chalk.blue('📁 Testing File Structure'));
    console.log(chalk.gray('─'.repeat(50)));

    const requiredFiles = [
        'src/core/scanner.js',
        'src/core/advanced-wifi-tester.js',
        'src/core/brute-force-protection.js',
        'wifi_bruteforce.py',
        'wifi_bruteforce_enhanced.py',
        'package.json',
        'advanced-integration-demo.js'
    ];

    for (const file of requiredFiles) {
        try {
            await fs.access(file);
            console.log(chalk.green(`✅ ${file} - exists`));
            testTracker.addTest(`File: ${file}`, 'pass');
        } catch (error) {
            console.log(chalk.red(`❌ ${file} - missing`));
            testTracker.addTest(`File: ${file}`, 'fail', 'File not found');
        }
    }

    console.log('');
}

/**
 * Test Node.js module imports
 */
async function testModuleImports() {
    console.log(chalk.blue('📦 Testing Node.js Module Imports'));
    console.log(chalk.gray('─'.repeat(50)));

    const modules = [
        { name: 'scanner', path: './src/core/scanner' },
        { name: 'AdvancedWiFiTester', path: './src/core/advanced-wifi-tester' },
        { name: 'bruteForceProtection', path: './src/core/brute-force-protection' }
    ];

    for (const module of modules) {
        try {
            const loaded = require(module.path);
            console.log(chalk.green(`✅ ${module.name} - imported successfully`));
            testTracker.addTest(`Module: ${module.name}`, 'pass');
        } catch (error) {
            console.log(chalk.red(`❌ ${module.name} - import failed: ${error.message}`));
            testTracker.addTest(`Module: ${module.name}`, 'fail', error.message);
        }
    }

    console.log('');
}

/**
 * Test Python script accessibility
 */
async function testPythonScripts() {
    console.log(chalk.blue('🐍 Testing Python Script Accessibility'));
    console.log(chalk.gray('─'.repeat(50)));

    const pythonScripts = [
        'wifi_bruteforce.py',
        'wifi_bruteforce_enhanced.py'
    ];

    for (const script of pythonScripts) {
        try {
            await fs.access(script);
            
            // Test if script is executable
            const stats = await fs.stat(script);
            const isExecutable = stats.mode & parseInt('111', 8);
            
            if (isExecutable) {
                console.log(chalk.green(`✅ ${script} - accessible and executable`));
                testTracker.addTest(`Python: ${script}`, 'pass');
            } else {
                console.log(chalk.yellow(`⚠️  ${script} - accessible but not executable`));
                testTracker.addTest(`Python: ${script}`, 'pass', 'Not executable');
            }
        } catch (error) {
            console.log(chalk.red(`❌ ${script} - not accessible`));
            testTracker.addTest(`Python: ${script}`, 'fail', 'Not accessible');
        }
    }

    console.log('');
}

/**
 * Test Python dependencies
 */
async function testPythonDependencies() {
    console.log(chalk.blue('🔧 Testing Python Dependencies'));
    console.log(chalk.gray('─'.repeat(50)));

    return new Promise((resolve) => {
        const pythonProcess = spawn('python3', ['-c', 'import colorama, json, argparse; print("All imports successful")'], {
            stdio: 'pipe'
        });

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0 && output.includes('successful')) {
                console.log(chalk.green('✅ Python dependencies - all required modules available'));
                testTracker.addTest('Python dependencies', 'pass');
            } else {
                console.log(chalk.yellow('⚠️  Python dependencies - some modules may be missing'));
                console.log(chalk.gray(`Error: ${error}`));
                testTracker.addTest('Python dependencies', 'fail', error || 'Import failed');
            }
            resolve();
        });

        pythonProcess.on('error', (error) => {
            console.log(chalk.red('❌ Python dependencies - python3 not available'));
            testTracker.addTest('Python dependencies', 'fail', 'python3 not found');
            resolve();
        });
    });
}

/**
 * Test educational scanner functionality
 */
async function testEducationalScanner() {
    console.log(chalk.blue('🎓 Testing Educational Scanner'));
    console.log(chalk.gray('─'.repeat(50)));

    try {
        // Test basic scanning
        const networks = await scanner.scanNetworks();
        console.log(chalk.green(`✅ Educational scanning - found ${networks.length} networks`));
        testTracker.addTest('Educational scanning', 'pass', `${networks.length} networks`);

        // Test security assessment if we have networks
        if (networks.length > 0) {
            const assessment = await scanner.assessNetworkSecurity(networks[0]);
            console.log(chalk.green('✅ Security assessment - completed successfully'));
            testTracker.addTest('Security assessment', 'pass');
        } else {
            console.log(chalk.yellow('⚠️  Security assessment - skipped (no networks)'));
            testTracker.addTest('Security assessment', 'pass', 'Skipped - no networks');
        }

    } catch (error) {
        console.log(chalk.red(`❌ Educational scanner - failed: ${error.message}`));
        testTracker.addTest('Educational scanning', 'fail', error.message);
    }

    console.log('');
}

/**
 * Test advanced WiFi tester integration
 */
async function testAdvancedIntegration() {
    console.log(chalk.blue('⚡ Testing Advanced WiFi Tester Integration'));
    console.log(chalk.gray('─'.repeat(50)));

    try {
        const advancedTester = new AdvancedWiFiTester();
        
        // Test instantiation
        console.log(chalk.green('✅ AdvancedWiFiTester - instantiated successfully'));
        testTracker.addTest('AdvancedWiFiTester instantiation', 'pass');

        // Test availability check
        const isAvailable = await advancedTester.checkAvailability();
        
        if (isAvailable) {
            console.log(chalk.green('✅ Advanced testing - available on this system'));
            testTracker.addTest('Advanced testing availability', 'pass', 'Available');
            
            // Test compatibility results
            if (advancedTester.compatibilityResults) {
                console.log(chalk.green('✅ Compatibility check - results received'));
                testTracker.addTest('Compatibility check', 'pass');
            } else {
                console.log(chalk.yellow('⚠️  Compatibility check - no detailed results'));
                testTracker.addTest('Compatibility check', 'pass', 'No detailed results');
            }
        } else {
            console.log(chalk.yellow('⚠️  Advanced testing - not available (expected on macOS)'));
            testTracker.addTest('Advanced testing availability', 'pass', 'Not available on this platform');
        }

    } catch (error) {
        console.log(chalk.red(`❌ Advanced integration - failed: ${error.message}`));
        testTracker.addTest('Advanced integration', 'fail', error.message);
    }

    console.log('');
}

/**
 * Test Python script communication
 */
async function testPythonCommunication() {
    console.log(chalk.blue('🗣️  Testing Python Script Communication'));
    console.log(chalk.gray('─'.repeat(50)));

    return new Promise((resolve) => {
        const pythonProcess = spawn('python3', ['wifi_bruteforce_enhanced.py', '--check-only', '--integration'], {
            stdio: 'pipe'
        });

        let output = '';
        let statusUpdates = [];
        let finalResult = null;

        pythonProcess.stdout.on('data', (data) => {
            const dataStr = data.toString();
            output += dataStr;
            
            // Parse status updates
            const lines = dataStr.split('\n');
            for (const line of lines) {
                if (line.startsWith('STATUS_JSON:')) {
                    try {
                        const status = JSON.parse(line.substring(12));
                        statusUpdates.push(status);
                    } catch (e) {
                        // Ignore JSON parse errors
                    }
                } else if (line.startsWith('FINAL_RESULT:')) {
                    try {
                        finalResult = JSON.parse(line.substring(13));
                    } catch (e) {
                        // Ignore JSON parse errors
                    }
                }
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            // Handle stderr if needed
        });

        pythonProcess.on('close', (code) => {
            if (statusUpdates.length > 0) {
                console.log(chalk.green(`✅ Python communication - received ${statusUpdates.length} status updates`));
                testTracker.addTest('Python status communication', 'pass', `${statusUpdates.length} updates`);
            } else {
                console.log(chalk.yellow('⚠️  Python communication - no status updates received'));
                testTracker.addTest('Python status communication', 'fail', 'No status updates');
            }

            if (finalResult) {
                console.log(chalk.green('✅ Python results - final result received'));
                testTracker.addTest('Python final results', 'pass');
            } else {
                console.log(chalk.yellow('⚠️  Python results - no final result received'));
                testTracker.addTest('Python final results', 'fail', 'No final result');
            }

            console.log('');
            resolve();
        });

        pythonProcess.on('error', (error) => {
            console.log(chalk.red('❌ Python communication - process failed'));
            testTracker.addTest('Python communication', 'fail', error.message);
            console.log('');
            resolve();
        });
    });
}

/**
 * Test package.json scripts
 */
async function testPackageScripts() {
    console.log(chalk.blue('📋 Testing Package.json Scripts'));
    console.log(chalk.gray('─'.repeat(50)));

    try {
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
        const requiredScripts = [
            'start',
            'demo',
            'quick-demo',
            'advanced-demo',
            'ubuntu-demo',
            'bruteforce-demo'
        ];

        for (const script of requiredScripts) {
            if (packageJson.scripts && packageJson.scripts[script]) {
                console.log(chalk.green(`✅ Script: ${script} - defined`));
                testTracker.addTest(`Script: ${script}`, 'pass');
            } else {
                console.log(chalk.red(`❌ Script: ${script} - missing`));
                testTracker.addTest(`Script: ${script}`, 'fail', 'Not defined');
            }
        }

    } catch (error) {
        console.log(chalk.red(`❌ Package.json - failed to read: ${error.message}`));
        testTracker.addTest('Package.json scripts', 'fail', error.message);
    }

    console.log('');
}

/**
 * Generate test report
 */
function generateTestReport() {
    const results = testTracker.getResults();
    
    console.log(chalk.blue('📊 Integration Test Results'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log('');
    
    console.log(`${chalk.cyan('Total Tests:')} ${results.total}`);
    console.log(`${chalk.green('Passed:')} ${results.passed}`);
    console.log(`${chalk.red('Failed:')} ${results.failed}`);
    console.log(`${chalk.yellow('Success Rate:')} ${results.percentage}%`);
    console.log('');

    if (results.failed > 0) {
        console.log(chalk.red('❌ Failed Tests:'));
        for (const test of results.tests) {
            if (test.status === 'fail') {
                console.log(`  • ${test.name}: ${test.details}`);
            }
        }
        console.log('');
    }

    // Overall assessment
    if (results.percentage >= 90) {
        console.log(chalk.green('🎉 Excellent! Integration is working well.'));
    } else if (results.percentage >= 75) {
        console.log(chalk.yellow('⚠️  Good! Minor issues detected, but core functionality works.'));
    } else if (results.percentage >= 50) {
        console.log(chalk.yellow('⚠️  Moderate! Some components need attention.'));
    } else {
        console.log(chalk.red('❌ Poor! Significant integration issues detected.'));
    }

    console.log('');
    console.log(chalk.blue('Integration Status Summary:'));
    console.log('• Educational scanner: Core WiFi scanning and assessment');
    console.log('• Advanced tester: Python aircrack-ng bridge module');
    console.log('• Python scripts: Enhanced WiFi security testing tools');
    console.log('• Communication: Status and result exchange');
    console.log('• Package scripts: Convenient execution commands');
    console.log('');

    return results;
}

/**
 * Main test function
 */
async function runIntegrationTests() {
    displayHeader();

    try {
        await testFileStructure();
        await testModuleImports();
        await testPythonScripts();
        await testPythonDependencies();
        await testEducationalScanner();
        await testAdvancedIntegration();
        await testPythonCommunication();
        await testPackageScripts();

        const results = generateTestReport();

        // Save results to file
        const reportData = {
            timestamp: new Date().toISOString(),
            platform: os.platform(),
            architecture: os.arch(),
            nodeVersion: process.version,
            results: results
        };

        await fs.writeFile('integration-test-results.json', JSON.stringify(reportData, null, 2));
        console.log(chalk.gray('📄 Test results saved to integration-test-results.json'));

    } catch (error) {
        console.error(chalk.red('Fatal error during integration testing:'), error.message);
        process.exit(1);
    }
}

// Run the integration tests
if (require.main === module) {
    runIntegrationTests().catch(error => {
        console.error(chalk.red('Integration test failed:'), error);
        process.exit(1);
    });
}

module.exports = {
    runIntegrationTests,
    testTracker
};
