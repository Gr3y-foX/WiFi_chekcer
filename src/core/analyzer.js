/**
 * WiFi Vulnerability Scanner - Security Analyzer Module
 * 
 * This module analyzes scan results to identify security vulnerabilities
 * and provide actionable recommendations for improving network security.
 */

/**
 * Analyzes security assessment results
 * 
 * @param {Object} results - Security assessment results
 * @returns {Object} Analysis report with vulnerabilities and recommendations
 */
function analyzeResults(results) {
    console.log("Evaluating network security...");
    const vulnerabilities = [];
    const recommendations = [];
    const educationalInsights = [];
    
    // Analyze encryption security
    analyzeEncryptionSecurity(results.network, vulnerabilities, recommendations);
    
    // Include brute force simulation educational insights
    if (results.bruteForceSimulation) {
        educationalInsights.push({
            title: "Brute Force Attack Simulation (Educational)",
            insights: results.bruteForceSimulation.educationalTakeaways,
            crackTimeEstimate: results.bruteForceSimulation.attackSimulation.estimatedTimeToBreak,
            feasibilityAssessment: results.bruteForceSimulation.attackSimulation.feasibilityAssessment,
            visualization: results.bruteForceSimulation.attackSimulation.progressVisualization
        });
    }
    
    // Add existing vulnerabilities and recommendations
    if (results.vulnerabilities) {
        vulnerabilities.push(...results.vulnerabilities);
    }
    
    if (results.recommendations) {
        recommendations.push(...results.recommendations);
    }
    
    // Add brute force recommendations
    if (results.bruteForceResults && results.bruteForceResults.bruteForceProtection) {
        recommendations.push(...results.bruteForceResults.bruteForceProtection.recommendations);
        
        // Add brute force vulnerabilities if found
        if (results.bruteForceResults.bruteForceProtection.vulnerabilities) {
            vulnerabilities.push(...results.bruteForceResults.bruteForceProtection.vulnerabilities);
        }
    }
    
    // Calculate overall security score (0-10)
    const securityScore = calculateSecurityScore(results, vulnerabilities);
    
    return {
        networkName: results.network.ssid,
        overallScore: securityScore,
        rating: getSecurityRating(securityScore),
        vulnerabilities,
        recommendations: [...new Set(recommendations)], // Remove duplicates
        educationalInsights,
        timestamp: new Date().toISOString()
    };
}

/**
 * Analyzes encryption security of a network
 * 
 * @param {Object} network - Network data with scan results
 * @param {Array} vulnerabilities - Array to add vulnerabilities to
 * @param {Array} recommendations - Array to add recommendations to
 */
function analyzeEncryptionSecurity(network, vulnerabilities, recommendations) {
    const encryption = network.encryption;
    
    switch (encryption) {
        case 'OPEN':
            vulnerabilities.push({
                name: 'Open Network (No Encryption)',
                description: 'Your network is not using any encryption. All data transmitted over this network can be captured and read.',
                severity: 'HIGH'
            });
            recommendations.push('Enable WPA2 or WPA3 encryption on your network immediately');
            recommendations.push('Set a strong password with at least 12 characters including letters, numbers, and symbols');
            break;
            
        case 'WEP':
            vulnerabilities.push({
                name: 'WEP Encryption',
                description: 'WEP encryption is broken and can be cracked in minutes using readily available tools.',
                severity: 'HIGH'
            });
            recommendations.push('Upgrade to WPA2 or WPA3 encryption immediately');
            recommendations.push('Replace router if it only supports WEP');
            break;
            
        case 'WPA':
            vulnerabilities.push({
                name: 'WPA Encryption (Outdated)',
                description: 'WPA encryption is outdated and vulnerable to various attacks including TKIP weaknesses.',
                severity: 'MEDIUM'
            });
            recommendations.push('Upgrade to WPA2 or WPA3 encryption');
            recommendations.push('Use a strong password with at least 12 characters');
            break;
            
        case 'WPA2':
            // WPA2 is generally good but has some vulnerabilities
            if (network.signal_level > -60) { // Strong signal extends outside
                vulnerabilities.push({
                    name: 'Strong Signal Propagation',
                    description: 'Your network signal is strong and may extend beyond your physical space, increasing attack surface.',
                    severity: 'LOW'
                });
                recommendations.push('Consider reducing transmit power if your router supports it');
            }
            break;
    }
}

/**
 * Calculates overall security score from 0-10
 * 
 * @param {Object} results - Assessment results
 * @param {Array} vulnerabilities - List of vulnerabilities
 * @returns {string} Security score (0-10)
 */
function calculateSecurityScore(results, vulnerabilities) {
    // Start with a perfect score
    let score = 10;
    
    // Deduct points based on vulnerability severity
    const highSeverityCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumSeverityCount = vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    const lowSeverityCount = vulnerabilities.filter(v => v.severity === 'LOW').length;
    
    // High severity issues have major impact
    score -= highSeverityCount * 2.5;
    
    // Medium severity issues have moderate impact
    score -= mediumSeverityCount * 1;
    
    // Low severity issues have minor impact
    score -= lowSeverityCount * 0.5;
    
    // Encryption type has a significant impact
    switch (results.network.encryption) {
        case 'OPEN':
            score -= 5;
            break;
        case 'WEP':
            score -= 4;
            break;
        case 'WPA':
            score -= 2;
            break;
        case 'WPA2':
            // No deduction
            break;
        case 'WPA3':
            // Bonus for using the best security
            score += 0.5;
            break;
    }
    
    // Cap the score between 0 and 10
    return Math.max(0, Math.min(10, score)).toFixed(1);
}

/**
 * Gets a text rating based on the security score
 * 
 * @param {number} score - Security score
 * @returns {string} Rating description
 */
function getSecurityRating(score) {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Fair';
    if (score >= 3) return 'Poor';
    return 'Critical';
}

module.exports = {
    analyzeResults
};
