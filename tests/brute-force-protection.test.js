/**
 * Brute Force Protection Test
 * 
 * This test file demonstrates how to use the brute force protection assessment feature.
 */

import Scanner from '../src/core/scanner.js';
import Analyzer from '../src/core/analyzer.js';

async function testBruteForceProtection() {
    console.log('===== WiFi Vulnerability Scanner: Brute Force Protection Test =====');
    
    try {
        // Initialize the scanner
        const scanner = new Scanner();
        console.log('Scanner initialized');
        
        // Run a network scan
        console.log('Scanning for networks...');
        const networks = await scanner.scan();
        console.log(`Found ${networks.length} networks:`);
        networks.forEach(network => {
            console.log(`- ${network.ssid} (${network.encryption || 'Unknown encryption'})`);
        });
        
        // Select a network for assessment
        const targetNetwork = networks[0]; // Using the first network for this example
        console.log(`\nSelected network for assessment: ${targetNetwork.ssid}`);
        
        // Run brute force protection assessment on the selected network
        console.log('\nRunning brute force protection assessment...');
        const securityResults = await scanner.assessNetworkSecurity(targetNetwork.ssid);
        
        // Display brute force protection results
        console.log('\n----- Brute Force Protection Assessment Results -----');
        console.log(`Overall Rating: ${securityResults.bruteForceProtection.overallRating}`);
        
        console.log('\nVulnerabilities:');
        securityResults.bruteForceProtection.vulnerabilities.forEach((vuln, i) => {
            console.log(`${i+1}. ${vuln.name} (Severity: ${vuln.severity})`);
            console.log(`   Details: ${vuln.description}`);
        });
        
        console.log('\nRecommendations:');
        securityResults.bruteForceProtection.recommendations.forEach((rec, i) => {
            console.log(`${i+1}. ${rec}`);
        });
        
        // Run full security analysis using the Analyzer
        console.log('\n\n===== Full Security Analysis =====');
        const analyzer = new Analyzer({[targetNetwork.ssid]: securityResults});
        const analysisReport = analyzer.evaluateSecurity();
        
        console.log(`Security Score: ${analysisReport.securityScore}/100`);
        
        console.log('\nAll Vulnerabilities:');
        analysisReport.vulnerabilities.forEach((vuln, i) => {
            console.log(`${i+1}. [${vuln.type}] ${vuln.issue}`);
            console.log(`   Network: ${vuln.ssid}`);
            console.log(`   Details: ${vuln.details}`);
        });
        
        console.log('\nTop Recommendations:');
        analysisReport.recommendations.slice(0, 5).forEach((rec, i) => {
            console.log(`${i+1}. ${rec}`);
        });
        
    } catch (error) {
        console.error('Error during brute force protection test:', error);
    }
}

// Run the test
testBruteForceProtection();
