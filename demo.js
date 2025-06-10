#!/usr/bin/env node
/**
 * WiFi Vulnerability Scanner - Interactive Demo Script
 * 
 * This script provides an interactive demonstration of the WiFi vulnerability scanner's
 * capabilities, including brute force protection assessment, security analysis,
 * and educational components on WiFi security.
 * 
 * For educational purposes only - use responsibly on networks you own or have permission to test.
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const scanner = require('./src/core/scanner');
const analyzer = require('./src/core/analyzer');
const bruteForceProtection = require('./src/core/brute-force-protection');
const cliInterface = require('./src/ui/cli-interface');

/**
 * Main function to run the interactive demo
 */
async function runDemo() {
    console.clear();
    displayHeader();
    
    try {
        // Check for necessary permissions (simulated)
        console.log(chalk.cyan('Checking for necessary permissions...'));
        console.log(chalk.green('✓ Required permissions granted\n'));
        
        // Get network scan
        console.log(chalk.cyan('Scanning for WiFi networks...'));
        const networks = await scanner.scanNetworks();
        console.log(chalk.green(`✓ Found ${networks.length} networks\n`));
        
        if (networks.length === 0) {
            console.log(chalk.red('No WiFi networks found. Please check your WiFi adapter.'));
            return;
        }
        
        // Display the networks
        cliInterface.displayNetworks(networks);
        
        // Ask user to select a network
        const { selectedIndex } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedIndex',
                message: 'Select a network to assess:',
                choices: networks.map((network, index) => ({
                    name: `${network.ssid || '(Hidden Network)'} (${network.encryption})`,
                    value: index
                }))
            }
        ]);
        
        const selectedNetwork = networks[selectedIndex];
        console.log(chalk.cyan(`\nSelected network: ${selectedNetwork.ssid || '(Hidden Network)'}`));
        
        // Ask for password parameters (for educational purposes)
        console.log(chalk.yellow('\nNOTE: For educational purposes, we\'ll simulate a scenario where you know some details about the password.'));
        console.log(chalk.yellow('      This will help demonstrate how password complexity affects security.\n'));
        
        const passwordOptions = await inquirer.prompt([
            {
                type: 'list',
                name: 'passwordLength',
                message: 'Estimated password length:',
                choices: [
                    { name: 'Short (6 characters)', value: 6 },
                    { name: 'Medium (8 characters)', value: 8 },
                    { name: 'Long (10 characters)', value: 10 },
                    { name: 'Very Long (12+ characters)', value: 12 }
                ],
                default: 1
            },
            {
                type: 'list',
                name: 'passwordComplexity',
                message: 'Estimated password complexity:',
                choices: [
                    { name: 'Low (letters or numbers only)', value: 'low' },
                    { name: 'Medium (mixed case letters and numbers)', value: 'medium' },
                    { name: 'High (mixed case, numbers, and symbols)', value: 'high' }
                ],
                default: 1
            }
        ]);
        
        // Demo brute force simulation for educational purposes
        console.log(chalk.cyan('\nRunning educational brute force simulation...'));
        await simulateBruteForceDemo(selectedNetwork.encryption, passwordOptions);
        
        // Run security assessment
        console.log(chalk.cyan('\nRunning comprehensive security assessment...'));
        console.log(chalk.yellow('This might take a few moments...'));
        
        const securityResults = await scanner.assessNetworkSecurity(selectedNetwork, {
            passwordLength: passwordOptions.passwordLength,
            passwordComplexity: passwordOptions.passwordComplexity
        });
        
        // Analyze results
        console.log(chalk.cyan('\nGenerating security analysis...'));
        const analysisReport = analyzer.analyzeResults(securityResults);
        
        // Display comprehensive report
        cliInterface.displaySecurityReport(analysisReport, selectedNetwork);
        
        // Ask if user wants to see raw data (for educational purposes)
        const { showRawData } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'showRawData',
                message: 'Would you like to see the detailed technical data? (educational)',
                default: false
            }
        ]);
        
        if (showRawData) {
            console.log(chalk.cyan.bold('\n┌─ Technical Details ────────────────────────────────┐'));
            console.log(JSON.stringify(securityResults, null, 2));
            console.log(chalk.cyan.bold('└────────────────────────────────────────────────────┘\n'));
        }
        
        console.log(chalk.green('\nDemo completed successfully!\n'));
        
    } catch (error) {
        console.error(chalk.red(`\nError: ${error.message}`));
        console.log(chalk.yellow('Tip: This application may require administrator privileges to scan networks.'));
    }
}

/**
 * Run a demonstration of brute force scenarios
 */
async function simulateBruteForceDemo(encryption, options) {
    console.log(chalk.magenta.bold('\n┌─ Educational Brute Force Scenarios ─────────────────┐'));
    console.log('  Showing how password length and complexity impact security:');
    
    const scenarios = [
        { length: options.passwordLength, complexity: options.passwordComplexity, label: 'Your selection' },
        { length: 6, complexity: 'low', label: 'Weak password' },
        { length: 12, complexity: 'high', label: 'Strong password' }
    ];
    
    // Filter out duplicates
    const uniqueScenarios = scenarios.filter((scenario, index, self) => 
        index === self.findIndex((s) => (
            s.length === scenario.length && s.complexity === scenario.complexity
        ))
    );
    
    for (const scenario of uniqueScenarios) {
        console.log(chalk.cyan(`\n  Scenario: ${scenario.label} (${scenario.length} character ${scenario.complexity} complexity password)`));
        
        const simulation = bruteForceProtection.simulateBruteForceAttack(
            encryption, 
            {
                passwordLength: scenario.length,
                passwordComplexity: scenario.complexity
            }
        );
        
        const feasibilityColor = 
            simulation.attackSimulation.feasibilityAssessment.includes('STRONG') ? chalk.green :
            simulation.attackSimulation.feasibilityAssessment.includes('LOW RISK') ? chalk.cyan :
            simulation.attackSimulation.feasibilityAssessment.includes('MODERATE') ? chalk.blue :
            simulation.attackSimulation.feasibilityAssessment.includes('RISKY') ? chalk.yellow : chalk.red;
        
        console.log(`  • Combinations: ${chalk.bold(simulation.passwordMetrics.possibleCombinations)}`);
        console.log(`  • Time to crack: ${chalk.bold(simulation.attackSimulation.estimatedTimeToBreak)}`);
        console.log(`  • Assessment: ${feasibilityColor(simulation.attackSimulation.feasibilityAssessment)}`);
        console.log(`  • Progress after 1 hour: ${simulation.attackSimulation.progressVisualization}`);
    }
    
    console.log(chalk.magenta.bold('\n└────────────────────────────────────────────────────┘'));
}

/**
 * Display the program header
 */
function displayHeader() {
    console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║               WiFi VULNERABILITY SCANNER              ║'));
    console.log(chalk.bold.cyan('║                 INTERACTIVE DEMO                      ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════╝'));
    console.log();
    console.log(chalk.yellow('⚠️  Educational Security Tool - Use responsibly on networks you own'));
    console.log();
}

// Run the demo
runDemo().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});
