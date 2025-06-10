/**
 * Brute Force Protection Test
 * 
 * This test file demonstrates how to use the brute force protection assessment feature.
 * Uses the functional approach to testing the scanner and analyzer.
 */

const scanner = require('../src/core/scanner');
const analyzer = require('../src/core/analyzer');
const bruteForceProtection = require('../src/core/brute-force-protection');
const chalk = require('chalk');

/**
 * Tests the brute force protection functionality
 */
async function testBruteForceProtection() {
    console.log(chalk.cyan.bold('===== WiFi Vulnerability Scanner: Brute Force Protection Test ====='));
    
    try {
        // Run a network scan
        console.log(chalk.cyan('Scanning for networks...'));
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
        
        // Select a network for assessment
        const targetNetwork = networks[0]; // Using the first network for this example
        console.log(chalk.cyan(`\nSelected network for assessment: ${targetNetwork.ssid}`));
        
        // Test different password lengths and complexities
        console.log(chalk.cyan('\nTesting various password scenarios for educational purposes:'));
        
        const scenarios = [
            { encryption: 'WPA2', length: 6, complexity: 'low' },
            { encryption: 'WPA2', length: 8, complexity: 'medium' },
            { encryption: 'WPA2', length: 10, complexity: 'medium' },
            { encryption: 'WPA2', length: 12, complexity: 'high' },
            { encryption: 'WPA3', length: 8, complexity: 'medium' }
        ];
        
        for (const scenario of scenarios) {
            console.log(chalk.yellow(`\nScenario: ${scenario.encryption} with ${scenario.length} char ${scenario.complexity} complexity password`));
            
            const simulation = bruteForceProtection.simulateBruteForceAttack(
                scenario.encryption, 
                {
                    passwordLength: scenario.length,
                    passwordComplexity: scenario.complexity
                }
            );
            
            console.log(`Combinations: ${simulation.passwordMetrics.possibleCombinations}`);
            console.log(`Crack time: ${simulation.attackSimulation.estimatedTimeToBreak}`);
            console.log(`Assessment: ${simulation.attackSimulation.feasibilityAssessment}`);
            console.log(`Progress after 1 hour: ${simulation.attackSimulation.progressVisualization}`);
        }
        
        // Run security assessment on the target network 
        console.log(chalk.cyan('\nRunning full security assessment...'));
        const securityResults = await scanner.assessNetworkSecurity(targetNetwork, {
            passwordLength: 8,
            passwordComplexity: 'medium'
        });
        
        // Display brute force protection results
        console.log(chalk.yellow.bold('\n----- Brute Force Protection Assessment Results -----'));
        console.log(`Overall Rating: ${chalk.yellow(securityResults.bruteForceResults.bruteForceProtection.overallRating)}`);
        
        console.log('\nVulnerabilities:');
        if (securityResults.bruteForceResults.bruteForceProtection.vulnerabilities.length === 0) {
            console.log(chalk.green('  No vulnerabilities detected'));
        } else {
            securityResults.bruteForceResults.bruteForceProtection.vulnerabilities.forEach((vuln, i) => {
                const severityColor = 
                    vuln.severity === 'HIGH' ? chalk.red :
                    vuln.severity === 'MEDIUM' ? chalk.yellow : chalk.cyan;
                    
                console.log(`${i+1}. ${chalk.bold(vuln.name)} (Severity: ${severityColor(vuln.severity)})`);
                console.log(`   Details: ${vuln.description}`);
            });
        }
        
        console.log('\nRecommendations:');
        securityResults.bruteForceResults.bruteForceProtection.recommendations.forEach((rec, i) => {
            console.log(`${i+1}. ${rec}`);
        });
        
        // Display brute force simulation educational results
        console.log(chalk.magenta.bold('\n----- Educational Brute Force Simulation -----'));
        const sim = securityResults.bruteForceSimulation;
        
        console.log(`\nEncryption: ${chalk.cyan(sim.encryption)}`);
        console.log(`Password complexity: ${chalk.cyan(sim.passwordMetrics.estimatedComplexity)} (charset size: ${sim.passwordMetrics.charsetSize} characters)`);
        console.log(`Password length: ${chalk.cyan(sim.passwordMetrics.estimatedLength)} characters`);
        console.log(`Possible combinations: ${chalk.cyan(sim.passwordMetrics.possibleCombinations)}`);
        
        console.log(`\nAttack simulation:`);
        console.log(`Attempts per second: ${chalk.yellow(sim.attackSimulation.attemptsPerSecond)}`);
        
        // Color the time estimate based on security level
        const timeEstimate = sim.attackSimulation.estimatedTimeToBreak;
        const timeColor = 
            timeEstimate.includes('decade') || timeEstimate.includes('year') ? chalk.green :
            timeEstimate.includes('month') ? chalk.cyan :
            timeEstimate.includes('week') ? chalk.blue :
            timeEstimate.includes('day') ? chalk.yellow : chalk.red;
            
        console.log(`Estimated time to crack: ${timeColor(timeEstimate)}`);
        console.log(`Assessment: ${timeColor(sim.attackSimulation.feasibilityAssessment)}`);
        console.log(`Progress visualization: ${sim.attackSimulation.progressVisualization}`);
        
        console.log(chalk.bold('\nEducational Takeaways:'));
        sim.educationalTakeaways.forEach((insight, i) => {
            console.log(`  ${i+1}. ${insight}`);
        });
        
        // Run full security analysis using the Analyzer
        console.log(chalk.cyan.bold('\n\n===== Full Security Analysis ====='));
        const analysisReport = analyzer.analyzeResults(securityResults);
        
        // Display full analysis report
        console.log(`Network: ${chalk.bold(analysisReport.networkName)}`);
        console.log(`Security Score: ${chalk.yellow(analysisReport.overallScore)}/10`);
        console.log(`Rating: ${chalk.yellow(analysisReport.rating)}`);
        
        console.log(chalk.bold('\nVulnerabilities:'));
        if (analysisReport.vulnerabilities.length === 0) {
            console.log(chalk.green('  No vulnerabilities detected'));
        } else {
            analysisReport.vulnerabilities.forEach((vuln, i) => {
                const severityColor = 
                    vuln.severity === 'HIGH' ? chalk.red :
                    vuln.severity === 'MEDIUM' ? chalk.yellow : chalk.cyan;
                    
                console.log(`${i+1}. ${chalk.bold(vuln.name)} (Severity: ${severityColor(vuln.severity)})`);
                if (vuln.description) {
                    console.log(`   Details: ${vuln.description}`);
                }
            });
        }
        
        console.log(chalk.bold('\nRecommendations:'));
        analysisReport.recommendations.forEach((rec, i) => {
            console.log(`${i+1}. ${rec}`);
        });
        
        // Show educational insights if available
        if (analysisReport.educationalInsights && analysisReport.educationalInsights.length > 0) {
            console.log(chalk.magenta.bold('\nEducational Insights:'));
            
            analysisReport.educationalInsights.forEach((insight) => {
                console.log(`\n${chalk.bold(insight.title)}`);
                
                if (insight.crackTimeEstimate) {
                    console.log(`Estimated time to crack: ${insight.crackTimeEstimate}`);
                }
                
                if (insight.feasibilityAssessment) {
                    console.log(`Assessment: ${insight.feasibilityAssessment}`);
                }
                
                if (insight.insights && insight.insights.length > 0) {
                    console.log(chalk.bold('\nKey Takeaways:'));
                    insight.insights.forEach((item, i) => {
                        console.log(`  • ${item}`);
                    });
                }
            });
        }
        
        console.log(chalk.green.bold('\nTest completed successfully!'));
        
    } catch (error) {
        console.error(chalk.red('Error during brute force protection test:'), error);
    }
}

// Run the test
testBruteForceProtection().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
});
