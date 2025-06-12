/**
 * Advanced WiFi Security Testing Bridge
 * 
 * This module provides a bridge between our educational Node.js scanner
 * and advanced Python-based WiFi security testing tools.
 * 
 * IMPORTANT: This is for advanced security professionals only.
 * Only use on networks you own or have explicit permission to test.
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

class AdvancedWiFiTester {
    constructor() {
        this.pythonScript = path.join(__dirname, '../../wifi_bruteforce_enhanced.py');
        this.legacyPythonScript = path.join(__dirname, '../../wifi_bruteforce.py');
        this.isAvailable = false;
        this.requiredTools = ['aircrack-ng', 'airodump-ng', 'aireplay-ng', 'macchanger'];
        this.compatibilityResults = null;
    }

    /**
     * Run comprehensive compatibility check using enhanced Python script
     * 
     * @returns {Promise<Object>} Detailed compatibility results
     */
    async runCompatibilityCheck() {
        console.log(chalk.blue('🔧 Running comprehensive compatibility check...'));
        
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', [this.pythonScript, '--check-only', '--integration'], {
                stdio: 'pipe'
            });

            let outputData = '';
            let statusUpdates = [];
            let finalResult = null;

            pythonProcess.stdout.on('data', (data) => {
                const output = data.toString();
                outputData += output;
                
                // Parse status updates
                const lines = output.split('\n');
                for (const line of lines) {
                    if (line.startsWith('STATUS_JSON:')) {
                        try {
                            const status = JSON.parse(line.substring(12));
                            statusUpdates.push(status);
                            this.displayStatusUpdate(status);
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
                console.log(chalk.yellow(`Python stderr: ${data}`));
            });

            pythonProcess.on('close', (code) => {
                this.compatibilityResults = finalResult || {
                    error: 'No results received',
                    code: code,
                    output: outputData
                };
                
                if (code === 0 && finalResult) {
                    console.log(chalk.green('✅ Compatibility check completed'));
                    resolve(this.compatibilityResults);
                } else {
                    console.log(chalk.yellow(`⚠️  Compatibility check completed with code ${code}`));
                    resolve(this.compatibilityResults);
                }
            });

            pythonProcess.on('error', (error) => {
                console.log(chalk.red('❌ Failed to run compatibility check:', error.message));
                reject(error);
            });
        });
    }

    /**
     * Display formatted status update from Python script
     * 
     * @param {Object} status - Status update from Python script
     */
    displayStatusUpdate(status) {
        const colors = {
            info: chalk.blue,
            success: chalk.green,
            warning: chalk.yellow,
            error: chalk.red
        };
        
        const color = colors[status.type] || chalk.white;
        const icon = {
            info: 'ℹ',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        }[status.type] || '•';
        
        console.log(color(`${icon} ${status.message}`));
    }

    /**
     * Check if advanced testing capabilities are available
     * 
     * @returns {Promise<boolean>} True if advanced testing is available
     */
    async checkAvailability() {
        try {
            // Check if enhanced Python script exists
            await fs.access(this.pythonScript);
            
            // Check if running on Linux (required for aircrack-ng)
            if (process.platform !== 'linux') {
                console.log(chalk.yellow('⚠️  Advanced WiFi testing requires Linux with aircrack-ng suite'));
                return false;
            }

            // Run comprehensive compatibility check
            const compatibilityResults = await this.runCompatibilityCheck();
            
            this.isAvailable = compatibilityResults.ready_for_testing || false;
            return this.isAvailable;
        } catch (error) {
            console.log(chalk.yellow('⚠️  Advanced WiFi testing not available:', error.message));
            return false;
        }
    }

    /**
     * Check if required tools are installed
     * 
     * @returns {Promise<boolean>} True if all tools are available
     */
    async checkRequiredTools() {
        const { exec } = require('child_process');
        const util = require('util');
        const execAsync = util.promisify(exec);

        console.log(chalk.blue('🔧 Checking advanced WiFi tools...'));
        
        for (const tool of this.requiredTools) {
            try {
                await execAsync(`which ${tool}`);
                console.log(chalk.green(`✓ ${tool} - Available`));
            } catch (error) {
                console.log(chalk.red(`✗ ${tool} - Missing`));
                console.log(chalk.yellow(`   Install with: sudo apt install aircrack-ng`));
                return false;
            }
        }
        
        return true;
    }

    /**
     * Display warnings and legal notices for advanced testing
     */
    displayLegalWarnings() {
        console.log(chalk.red.bold('⚠️  ADVANCED WIFI SECURITY TESTING - LEGAL WARNING ⚠️'));
        console.log(chalk.red('═'.repeat(60)));
        console.log(chalk.yellow('This feature provides access to advanced WiFi security testing tools.'));
        console.log(chalk.yellow('These tools can perform actual WiFi penetration testing.'));
        console.log('');
        console.log(chalk.red.bold('LEGAL REQUIREMENTS:'));
        console.log('• Only use on networks you own or have written permission to test');
        console.log('• Unauthorized WiFi testing is illegal in most jurisdictions');
        console.log('• You are responsible for compliance with local laws');
        console.log('• This is intended for security professionals and researchers');
        console.log('');
        console.log(chalk.red.bold('TECHNICAL REQUIREMENTS:'));
        console.log('• Linux operating system with WiFi adapter');
        console.log('• Root/administrator privileges');
        console.log('• aircrack-ng suite installed');
        console.log('• Compatible wireless network interface');
        console.log('');
        console.log(chalk.red('═'.repeat(60)));
    }

    /**
     * Get user consent for advanced testing
     * 
     * @returns {Promise<boolean>} True if user consents
     */
    async getUserConsent() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query) => new Promise(resolve => rl.question(query, resolve));

        try {
            this.displayLegalWarnings();
            
            const consent1 = await question(chalk.yellow('Do you own or have written permission to test the target network? (yes/no): '));
            if (consent1.toLowerCase() !== 'yes') {
                console.log(chalk.red('❌ Advanced testing aborted - permission required'));
                return false;
            }

            const consent2 = await question(chalk.yellow('Do you understand the legal implications and accept responsibility? (yes/no): '));
            if (consent2.toLowerCase() !== 'yes') {
                console.log(chalk.red('❌ Advanced testing aborted - legal acknowledgment required'));
                return false;
            }

            const consent3 = await question(chalk.yellow('Are you a security professional or researcher? (yes/no): '));
            if (consent3.toLowerCase() !== 'yes') {
                console.log(chalk.red('❌ Advanced testing aborted - intended for professionals only'));
                return false;
            }

            console.log(chalk.green('✅ Consent granted - proceeding with advanced testing'));
            return true;
        } finally {
            rl.close();
        }
    }

    /**
     * Launch the enhanced Python WiFi security testing script
     * 
     * @param {Object} options - Testing options
     * @returns {Promise<void>}
     */
    async launchAdvancedTesting(options = {}) {
        if (!this.isAvailable) {
            throw new Error('Advanced testing not available - check requirements');
        }

        console.log(chalk.blue('🚀 Launching enhanced WiFi security testing...'));
        console.log(chalk.gray('Using enhanced Python aircrack-ng integration'));
        console.log('');

        const args = [this.pythonScript, '--integration'];
        
        if (options.autoMode) {
            args.push('--auto-mode');
        }
        
        if (options.targetSSID) {
            args.push('--target-ssid', options.targetSSID);
        }
        
        if (options.wordlist) {
            args.push('--wordlist', options.wordlist);
        }

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', args, {
                stdio: 'inherit',
                cwd: path.dirname(this.pythonScript)
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(chalk.green('✅ Enhanced advanced testing completed'));
                    resolve();
                } else {
                    console.log(chalk.red(`❌ Advanced testing failed with code ${code}`));
                    reject(new Error(`Enhanced Python script failed with code ${code}`));
                }
            });

            pythonProcess.on('error', (error) => {
                console.log(chalk.red('❌ Failed to launch enhanced Python script:', error.message));
                reject(error);
            });
        });
    }

    /**
     * Launch advanced testing in demonstration mode
     * 
     * @returns {Promise<void>}
     */
    async launchDemonstration() {
        console.log(chalk.blue('🎓 Launching advanced testing demonstration...'));
        console.log(chalk.gray('Running in safe educational mode'));
        console.log('');

        return this.launchAdvancedTesting({ autoMode: true });
    }

    /**
     * Provide installation instructions for required tools
     */
    showInstallationInstructions() {
        console.log(chalk.blue('📋 Advanced WiFi Testing Setup Instructions'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log('');
        console.log(chalk.yellow('System Requirements:'));
        console.log('• Linux operating system (Ubuntu, Kali, etc.)');
        console.log('• Root/sudo privileges');
        console.log('• Compatible WiFi adapter');
        console.log('• Python 3.x with pip');
        console.log('');
        console.log(chalk.yellow('Installation Commands:'));
        console.log(chalk.cyan('# Install aircrack-ng suite'));
        console.log('sudo apt update');
        console.log('sudo apt install aircrack-ng');
        console.log('');
        console.log(chalk.cyan('# Install Python dependencies'));
        console.log('pip3 install colorama');
        console.log('');
        console.log(chalk.cyan('# Make script executable'));
        console.log('chmod +x wifi_bruteforce.py');
        console.log('');
        console.log(chalk.yellow('Usage:'));
        console.log('sudo python3 wifi_bruteforce.py');
        console.log('');
        console.log(chalk.red('⚠️  Remember: Only use on networks you own!'));
    }

    /**
     * Integrate with educational scanner results
     * 
     * @param {Array} networks - Networks from educational scan
     * @returns {Object} Enhanced results with advanced testing options
     */
    enhanceEducationalResults(networks) {
        return {
            educationalNetworks: networks,
            advancedTestingAvailable: this.isAvailable,
            advancedTestingNote: this.isAvailable ? 
                'Advanced testing with aircrack-ng is available' :
                'Advanced testing requires Linux with aircrack-ng suite',
            recommendations: [
                'Educational scanning completed with simulated results',
                'For actual penetration testing, use advanced mode (professionals only)',
                'Ensure you have proper authorization before real testing',
                'Consider using dedicated security testing distributions like Kali Linux'
            ]
        };
    }
}

module.exports = AdvancedWiFiTester;
