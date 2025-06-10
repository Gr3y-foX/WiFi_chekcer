/**
 * CLI Interface for WiFi Vulnerability Scanner
 * 
 * Provides interactive command-line interface for scanning and analyzing WiFi networks.
 * Educational purposes only.
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const scanner = require('../core/scanner');
const analyzer = require('../core/analyzer');
const logger = require('../utils/logger');
const permissions = require('../utils/permissions');

/**
 * Displays the scan results in a formatted way
 * 
 * @param {Array} networks - List of detected networks
 */
function displayNetworks(networks) {
    console.clear();
    console.log(chalk.cyan.bold('┌─ Scanned WiFi Networks ─────────────────────────────┐'));
    
    if (networks.length === 0) {
        console.log(chalk.yellow('  No networks found. Please check your WiFi adapter.'));
    } else {
        networks.forEach((network, index) => {
            const securityColor = getSecurityColor(network.encryption);
            console.log(`${index + 1}. ${chalk.bold(network.ssid || '(Hidden Network)')} - Signal: ${network.signal_level}dBm`);
            console.log(`   Security: ${securityColor(network.encryption)} - Channel: ${network.channel || 'Unknown'}`);
            if (network.bssid) {
                console.log(`   MAC: ${network.bssid}`);
            }
            console.log();
        });
    }
    
    console.log(chalk.cyan.bold('└────────────────────────────────────────────────────┘'));
}

/**
 * Returns color function based on security level
 */
function getSecurityColor(encryption) {
    switch (encryption) {
        case 'WPA3': return chalk.green;
        case 'WPA2': return chalk.cyan;
        case 'WPA': return chalk.yellow;
        case 'WEP': return chalk.red;
        case 'OPEN': return chalk.red.bold;
        default: return chalk.gray;
    }
}

/**
 * Displays a security report in a formatted way
 * 
 * @param {Object} analysisReport - Security analysis report
 * @param {Object} network - The assessed network
 */
function displaySecurityReport(analysisReport, network) {
    console.clear();
    
    // Network info section
    console.log(chalk.cyan.bold('┌─ WIFI SECURITY ASSESSMENT REPORT ─────────────────────┐'));
    console.log(`Network: ${chalk.bold(network.ssid || '(Hidden Network)')}`);
    if (network.bssid) {
        console.log(`MAC Address: ${network.bssid}`);
    }
    console.log(`Encryption: ${getSecurityColor(network.encryption)(network.encryption)}`);
    console.log(chalk.cyan.bold('├─ Security Score ────────────────────────────────────┤'));
    
    // Score visualization
    const score = analysisReport.overallScore;
    const scoreColor = score >= 8 ? chalk.green : (score >= 5 ? chalk.yellow : chalk.red);
    console.log(`Overall Security: ${scoreColor(score)}/10 - Rating: ${scoreColor(analysisReport.rating)}`);
    
    // Display score bar
    showScoreBar(score);
    
    // Vulnerabilities section
    console.log(chalk.cyan.bold('├─ Vulnerabilities ────────────────────────────────────┤'));
    if (analysisReport.vulnerabilities.length === 0) {
        console.log(chalk.green('  ✓ No vulnerabilities detected'));
    } else {
        analysisReport.vulnerabilities.forEach((vuln, index) => {
            const severityColor = 
                vuln.severity === 'HIGH' ? chalk.red :
                vuln.severity === 'MEDIUM' ? chalk.yellow : chalk.cyan;
            
            console.log(`  ${index + 1}. ${chalk.bold(vuln.name)} - Severity: ${severityColor(vuln.severity)}`);
            console.log(`     ${vuln.description}`);
            console.log();
        });
    }
    
    // Recommendations section
    console.log(chalk.cyan.bold('├─ Security Recommendations ─────────────────────────────┤'));
    if (analysisReport.recommendations.length === 0) {
        console.log(chalk.green('  ✓ No recommendations needed'));
    } else {
        analysisReport.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec}`);
        });
    }
    
    // Educational Insights section
    if (analysisReport.educationalInsights && analysisReport.educationalInsights.length > 0) {
        console.log(chalk.cyan.bold('├─ Educational Insights ─────────────────────────────────┤'));
        
        analysisReport.educationalInsights.forEach((insight, idx) => {
            console.log(chalk.bold(`  ${insight.title}`));
            
            if (insight.crackTimeEstimate) {
                const crackTimeColor = 
                    insight.crackTimeEstimate.includes('decades') || 
                    insight.crackTimeEstimate.includes('years') ? chalk.green :
                    insight.crackTimeEstimate.includes('months') ? chalk.cyan :
                    insight.crackTimeEstimate.includes('weeks') ? chalk.blue :
                    insight.crackTimeEstimate.includes('days') ? chalk.yellow : chalk.red;
                
                console.log(`  Estimated time to crack: ${crackTimeColor(insight.crackTimeEstimate)}`);
            }
            
            if (insight.feasibilityAssessment) {
                const feasibilityColor = 
                    insight.feasibilityAssessment.includes('STRONG') ? chalk.green :
                    insight.feasibilityAssessment.includes('LOW RISK') ? chalk.cyan :
                    insight.feasibilityAssessment.includes('MODERATE') ? chalk.blue :
                    insight.feasibilityAssessment.includes('RISKY') ? chalk.yellow : chalk.red;
                
                console.log(`  Assessment: ${feasibilityColor(insight.feasibilityAssessment)}`);
            }
            
            if (insight.visualization) {
                console.log(`  Brute force progress after 1 hour: ${insight.visualization}`);
            }
            
            if (insight.insights && insight.insights.length > 0) {
                console.log(chalk.bold('\n  Key Takeaways:'));
                insight.insights.forEach((item, i) => {
                    console.log(`    • ${item}`);
                });
            }
            
            console.log(); // Empty line for spacing
        });
    }
    
    console.log(chalk.cyan.bold('└────────────────────────────────────────────────────┘'));
    console.log();
}

/**
 * Show a visual score bar
 * 
 * @param {number} score - Security score from 0-10
 */
function showScoreBar(score) {
    const totalBars = 20;
    const filledBars = Math.round(score * 2);
    const emptyBars = totalBars - filledBars;
    
    const barColor = score >= 8 ? chalk.green : (score >= 5 ? chalk.yellow : chalk.red);
    
    const bar = barColor('█'.repeat(filledBars)) + chalk.gray('░'.repeat(emptyBars));
    console.log(`  ${bar} ${score}/10`);
    console.log();
}

module.exports = {
    displayNetworks,
    displaySecurityReport
};