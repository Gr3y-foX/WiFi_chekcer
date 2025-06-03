/**
 * WiFi Vulnerability Scanner - Security Analyzer Module
 * 
 * This module analyzes scan results to identify security vulnerabilities
 * and provide actionable recommendations for improving network security.
 */

class Analyzer {
    constructor(scanResults) {
        this.scanResults = scanResults; // Store the scan results for analysis
        this.vulnerabilities = [];
        this.securityScore = 0;
        this.recommendations = [];
    }

    /**
     * Analyze the collected data and generate a comprehensive security report
     * 
     * @returns {Object} Security analysis report with vulnerabilities and recommendations
     */
    evaluateSecurity() {
        console.log("Evaluating network security...");
        this.vulnerabilities = [];

        // Process each network in scan results
        Object.values(this.scanResults).forEach(network => {
            this._analyzeEncryptionSecurity(network);
            this._analyzeBruteForceProtection(network);
            // Additional security analysis methods will be added here
        });

        // Calculate overall security score
        this.securityScore = this._calculateSecurityScore();
        
        // Generate consolidated recommendations
        this.recommendations = this._generateConsolidatedRecommendations();

        return {
            vulnerabilities: this.vulnerabilities,
            securityScore: this.securityScore,
            recommendations: this.recommendations,
            networks: this.scanResults
        };
    }

    /**
     * Analyze encryption security of a network
     * 
     * @param {Object} network - Network data with scan results
     */
    _analyzeEncryptionSecurity(network) {
        const { encryption } = network.network;

        // Check for open networks (no encryption)
        if (!encryption || encryption === "None") {
            this.vulnerabilities.push({
                ssid: network.network.ssid,
                type: 'CRITICAL',
                issue: 'Open Network (No Encryption)',
                details: 'This network has no password protection. All traffic can be intercepted.'
            });
        }
        
        // Check for outdated encryption
        if (encryption === "WEP") {
            this.vulnerabilities.push({
                ssid: network.network.ssid,
                type: 'CRITICAL',
                issue: 'Outdated WEP Encryption',
                details: 'WEP encryption can be cracked in minutes. Upgrade to WPA2 or WPA3.'
            });
        }
        
        // Check for old but still somewhat secure encryption
        if (encryption === "WPA") {
            this.vulnerabilities.push({
                ssid: network.network.ssid,
                type: 'HIGH',
                issue: 'Outdated WPA Encryption',
                details: 'WPA has known vulnerabilities. Upgrade to WPA2 or WPA3.'
            });
        }
    }

    /**
     * Analyze brute force protection of a network
     * 
     * @param {Object} network - Network data with scan results
     */
    _analyzeBruteForceProtection(network) {
        // If brute force protection assessment exists
        if (network.bruteForceProtection) {
            // Add all vulnerabilities from the brute force assessment
            network.bruteForceProtection.vulnerabilities.forEach(vuln => {
                this.vulnerabilities.push({
                    ssid: network.network.ssid,
                    type: vuln.severity,
                    issue: vuln.name,
                    details: vuln.description
                });
            });
        } else {
            // If brute force assessment wasn't run
            this.vulnerabilities.push({
                ssid: network.network.ssid,
                type: 'UNKNOWN',
                issue: 'Brute Force Protection Not Assessed',
                details: 'Could not determine if this network is protected against brute force attacks.'
            });
        }
    }
    
    /**
     * Calculate overall security score based on vulnerabilities
     * 
     * @returns {number} Security score from 0-100 (higher is better)
     */
    _calculateSecurityScore() {
        // Start with perfect score
        let score = 100;
        
        // Reduce score based on vulnerability severity
        this.vulnerabilities.forEach(vuln => {
            switch(vuln.type) {
                case 'CRITICAL':
                    score -= 25;
                    break;
                case 'HIGH':
                    score -= 15;
                    break;
                case 'MEDIUM':
                    score -= 10;
                    break;
                case 'LOW':
                    score -= 5;
                    break;
                default:
                    score -= 2; // Unknown severity
            }
        });
        
        // Ensure score doesn't go below 0
        return Math.max(0, score);
    }
    
    /**
     * Generate consolidated list of recommendations
     * 
     * @returns {Array} List of unique recommendations
     */
    _generateConsolidatedRecommendations() {
        const allRecommendations = [];
        
        // Collect recommendations from all network assessments
        Object.values(this.scanResults).forEach(network => {
            if (network.recommendations) {
                allRecommendations.push(...network.recommendations);
            }
        });
        
        // Remove duplicates
        return [...new Set(allRecommendations)];
    }
}

export default Analyzer;