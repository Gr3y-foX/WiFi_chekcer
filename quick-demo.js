#!/usr/bin/env node
/**
 * WiFi Vulnerability Scanner - Non-Interactive Demo Script
 * 
 * This script provides a non-interactive demonstration of the WiFi vulnerability scanner's
 * capabilities, focusing on the brute force protection module.
 * 
 * For educational purposes only - use responsibly on networks you own or have permission to test.
 */

const chalk = require('chalk');
const scanner = require('./src/core/scanner');
const analyzer = require('./src/core/analyzer');
const bruteForceProtection = require('./src/core/brute-force-protection');

/**
 * Main function to run the non-interactive demo
 */
async function runNonInteractiveDemo() {
    console.clear();
    displayHeader();
    
    try {
        // Get network scan
        console.log(chalk.cyan('Scanning for WiFi networks...'));
        const networks = await scanner.scanNetworks();
        console.log(chalk.green(`Found ${networks.length} networks:`));
        
        networks.forEach((network, index) => {
            const securityColor = 
                network.encryption === 'WPA3' ? chalk.green :
                network.encryption === 'WPA2' ? chalk.cyan :
                network.encryption === 'WPA' ? chalk.yellow :
                chalk.red;
                
            console.log(`${index + 1}. ${network.ssid || '(Hidden Network)'} (${securityColor(network.encryption || 'Unknown')})`);
        });
        
        // Select a network for assessment (first one by default)
        const targetNetwork = networks[0]; 
        console.log(chalk.cyan(`\nSelected network for assessment: ${targetNetwork.ssid}`));
        
        // Demo different password scenarios
        console.log(chalk.cyan('\nTesting various password scenarios for educational purposes:'));
        
        const scenarios = [
            { encryption: 'WPA2', length: 6, complexity: 'low', label: 'Weak password' },
            { encryption: 'WPA2', length: 8, complexity: 'medium', label: 'Medium password' },
            { encryption: 'WPA2', length: 12, complexity: 'high', label: 'Strong password' },
            { encryption: 'WPA3', length: 8, complexity: 'medium', label: 'Medium password with WPA3' }
        ];
        
        for (const scenario of scenarios) {
            console.log(chalk.yellow(`\nScenario: ${scenario.label} (${scenario.encryption}, ${scenario.length} characters, ${scenario.complexity} complexity)`));
            
            // Use enhanced assessment for more realistic results
            const enhancedAssessment = bruteForceProtection.enhancedPasswordStrengthAssessment(
                targetNetwork.ssid,
                { encryption: scenario.encryption },
                { vendor: 'Generic' }
            );
            
            const simulation = bruteForceProtection.simulateBruteForceAttack(
                scenario.encryption, 
                {
                    passwordLength: scenario.length,
                    passwordComplexity: scenario.complexity
                }
            );
            
            console.log(`Dictionary passwords tested: ${enhancedAssessment.dictionaryResults.testedPasswords}`);
            console.log(`Generated passwords: ${enhancedAssessment.generatedPasswordResults.generatedPasswords}`);
            console.log(`Realistic crack time: ${enhancedAssessment.estimatedCrackTime}`);
            console.log(`Risk level: ${enhancedAssessment.riskLevel}`);
            console.log(`Classic simulation: ${simulation.attackSimulation.estimatedTimeToBreak}`);
            console.log(`Progress after 1 hour: ${simulation.attackSimulation.progressVisualization}`);
            
            // Show potential vulnerabilities
            if (enhancedAssessment.dictionaryResults.potentialMatches.length > 0) {
                console.log(chalk.red(`   ⚠️  Found ${enhancedAssessment.dictionaryResults.potentialMatches.length} potential password vulnerabilities`));
            }
        }
        
        // Run full security assessment with medium complexity password
        console.log(chalk.cyan('\nRunning full security assessment...'));
        const securityResults = await scanner.assessNetworkSecurity(targetNetwork, {
            passwordLength: 8,
            passwordComplexity: 'medium'
        });
        
        // Analyze results
        const analysisReport = analyzer.analyzeResults(securityResults);
        
        // Display summary report
        console.log(chalk.bold.cyan('\n╔═══ SECURITY REPORT ════════════════════════════════════╗'));
        console.log(`Network: ${targetNetwork.ssid}`);
        console.log(`Security Score: ${analysisReport.overallScore}/10`);
        console.log(`Rating: ${analysisReport.rating}`);
        
        // Show vulnerabilities
        if (analysisReport.vulnerabilities.length > 0) {
            console.log(chalk.bold.yellow('\nVulnerabilities Found:'));
            analysisReport.vulnerabilities.forEach((vuln, index) => {
                const severityColor = 
                    vuln.severity === 'HIGH' ? chalk.red :
                    vuln.severity === 'MEDIUM' ? chalk.yellow : chalk.cyan;
                
                console.log(`${index + 1}. ${chalk.bold(vuln.name)} - Severity: ${severityColor(vuln.severity)}`);
                console.log(`   ${vuln.description}`);
            });
        } else {
            console.log(chalk.green('\nNo vulnerabilities detected'));
        }
        
        // Educational content from brute force simulation
        console.log(chalk.magenta.bold('\n----- Educational Content -----'));
        const sim = securityResults.bruteForceSimulation;
        
        console.log(`\nPassword strength educational insights:`);
        sim.educationalTakeaways.forEach((insight, i) => {
            console.log(`  • ${insight}`);
        });
        
        console.log(chalk.bold.cyan('\n╚═══════════════════════════════════════════════════════╝'));
        
        console.log(chalk.green('\nDemo completed successfully!\n'));
        console.log(chalk.cyan('To run the interactive demo, use: npm run demo'));
        console.log(chalk.cyan('To run a full scan, use: npm start\n'));
        
    } catch (error) {
        console.error(chalk.red(`\nError: ${error.message}`));
        console.log(chalk.yellow('Tip: This application may require administrator privileges to scan networks.'));
    }
}

/**
 * Display the program header
 */
function displayHeader() {
    console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║               WiFi VULNERABILITY SCANNER              ║'));
    console.log(chalk.bold.cyan('║              NON-INTERACTIVE DEMO                     ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════╝'));
    console.log();
    console.log(chalk.yellow('⚠️  Educational Security Tool - Use responsibly on networks you own'));
    console.log();
}

// Run the demo
runNonInteractiveDemo().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});
