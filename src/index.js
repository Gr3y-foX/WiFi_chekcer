/**
 * WiFi Vulnerability Scanner - Entry Point
 * 
 * This file serves as the main entry point for our WiFi security assessment tool.
 * For educational purposes only - use only on networks you own or have permission to test.
 */

const chalk = require('chalk');
const scanner = require('./core/scanner');
const analyzer = require('./core/analyzer');

/**
 * Main function to start the application
 */
async function main() {
    console.clear();
    console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║               WiFi VULNERABILITY SCANNER              ║'));
    console.log(chalk.bold.cyan('║                                                       ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════╝'));
    console.log();
    console.log(chalk.yellow('⚠️  Educational Security Tool - Use responsibly on networks you own'));
    console.log();
    
    try {
        // Scan for WiFi networks
        console.log(chalk.cyan('Scanning for WiFi networks...'));
        const networks = await scanner.scanNetworks();
        console.log(chalk.green(`Found ${networks.length} networks`));
        
        if (networks.length === 0) {
            console.log(chalk.red('No WiFi networks found. Please check your WiFi adapter.'));
            return;
        }
        
        // Display found networks
        console.log('\nAvailable networks:');
        networks.forEach((network, index) => {
            const securityColor = 
                network.encryption === 'WPA3' ? chalk.green :
                network.encryption === 'WPA2' ? chalk.blue :
                network.encryption === 'WPA' ? chalk.yellow :
                chalk.red;
            
            console.log(`${index + 1}. ${network.ssid} - ${securityColor(network.encryption || 'Unknown')}`);
        });
        
        // For now, just select the first network
        const selectedNetwork = networks[0];
        console.log(chalk.cyan(`\nSelected network: ${selectedNetwork.ssid}`));
        
        // Run security assessment
        console.log(chalk.cyan('\nRunning security assessment...'));
        const securityResults = await scanner.assessNetworkSecurity(selectedNetwork);
        
        // Analyze results
        console.log(chalk.cyan('\nAnalyzing security posture...'));
        const analysisReport = analyzer.analyzeResults(securityResults);
        
        // Display report
        console.log(chalk.bold.cyan('\n╔═══ SECURITY REPORT ════════════════════════════════════╗'));
        console.log(`Network: ${selectedNetwork.ssid}`);
        console.log(`Security Score: ${analysisReport.overallScore}/10`);
        console.log(`Rating: ${analysisReport.rating}`);
        
        // Show vulnerabilities
        if (analysisReport.vulnerabilities.length > 0) {
            console.log(chalk.bold.yellow('\nVulnerabilities Found:'));
            analysisReport.vulnerabilities.forEach((vuln, index) => {
                const severityColor = 
                    vuln.severity === 'HIGH' ? chalk.red :
                    vuln.severity === 'MEDIUM' ? chalk.yellow : chalk.blue;
                
                console.log(`${index + 1}. ${chalk.bold(vuln.name)} - Severity: ${severityColor(vuln.severity)}`);
                console.log(`   ${vuln.description}`);
            });
        } else {
            console.log(chalk.green('\nNo vulnerabilities detected'));
        }
        
        // Show recommendations
        if (analysisReport.recommendations.length > 0) {
            console.log(chalk.bold.cyan('\nRecommendations:'));
            analysisReport.recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. ${rec}`);
            });
        }
        
        console.log(chalk.bold.cyan('\n╚═══════════════════════════════════════════════════════╝'));
        
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
        console.log(chalk.yellow('Tip: This application may require administrator privileges to scan networks.'));
    }
}

// Run the application
main().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});