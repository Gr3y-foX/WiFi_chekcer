/**
 * WiFi Vulnerability Scanner - Brute Force Protection Module
 * 
 * This module contains functions to assess a network's resistance to brute force attacks.
 * It checks for various protection mechanisms that prevent automated password guessing.
 * 
 * EDUCATIONAL NOTES:
 * -----------------
 * Brute force attacks occur when attackers systematically try all possible passwords
 * until they find the correct one. Modern tools can attempt millions of passwords per second.
 * 
 * Key defenses against brute force attacks:
 * 1. Strong passwords (length, complexity, unpredictability)
 * 2. Rate limiting (slowing down excessive login attempts)
 * 3. Lockout mechanisms (temporarily blocking access after failed attempts)
 * 4. Modern encryption (WPA3 provides stronger protection than older protocols)
 * 
 * This module simulates tests to check for these protections on WiFi networks.
 */

/**
 * Tests if a WiFi network has rate limiting protection against excessive login attempts
 * 
 * @param {Object} networkInterface - The network interface to test
 * @param {number} testAttempts - Number of connection attempts to make (default: 3, kept low for testing)
 * @param {number} timeWindowMs - Time window to make attempts in (milliseconds)
 * @returns {Object} Result object with protection status and details
 */
async function checkRateLimiting(networkInterface, testAttempts = 3, timeWindowMs = 5000) {
    console.log('Testing rate limiting protection...');

    // EDUCATIONAL NOTE:
    // =================
    // Rate limiting works by tracking connection attempts and blocking IPs or
    // MAC addresses that exceed a threshold in a given time period. This prevents
    // automated tools from trying thousands of passwords per minute.
    //
    // Without rate limiting, attackers can:
    // - Try up to 100-1000+ passwords per second (depending on hardware)
    // - Run dictionary attacks containing millions of common passwords
    // - Utilize cloud computing to accelerate cracking attempts
    // 
    // Good rate limiting should:
    // - Block an IP after 3-5 failed attempts within a small time window
    // - Implement exponential backoff (each failure increases wait time)
    // - Log and potentially alert on multiple failed auth attempts

    // In a real implementation, we would:
    // 1. Make rapid connection attempts with invalid credentials
    // 2. Measure if/when we get blocked or throttled
    // 3. Analyze the timing between blocks to identify the protection algorithm
    
    // For educational simulation, we'll randomly generate a result
    // with a 30% chance of having rate limiting
    const hasProtection = Math.random() > 0.7;
    
    // Simulate response time variations that might indicate rate limiting
    const simulateRateLimitingDelay = async (attempt) => {
        // Simulate network delay
        const baseDelay = 100 + Math.random() * 200; // base network delay 100-300ms
        
        if (hasProtection && attempt > 2) {
            // Exponential backoff simulation
            const backoffDelay = Math.pow(2, attempt - 2) * 500;
            await new Promise(resolve => setTimeout(resolve, baseDelay + backoffDelay));
            return true;
        } else {
            // Normal response time
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            return false;
        }
    };
    
    // Measure response times to detect rate limiting pattern
    const responseTimes = [];
    let limitDetected = false;
    let attemptsBeforeLimit = 0;
    
    for (let i = 0; i < testAttempts; i++) {
        const startTime = Date.now();
        limitDetected = await simulateRateLimitingDelay(i);
        const endTime = Date.now();
        responseTimes.push(endTime - startTime);
        
        if (limitDetected && attemptsBeforeLimit === 0) {
            attemptsBeforeLimit = i;
        }
    }

    const results = {
        hasRateLimiting: hasProtection,
        attemptsBeforeLimit: hasProtection ? (attemptsBeforeLimit || 3) : 0,
        timeWindowSeconds: timeWindowMs / 1000,
        responseTimes, // Educational: show the pattern of response times
        riskLevel: hasProtection ? 'MEDIUM' : 'HIGH',
        recommendations: [
            'Enable rate limiting on your router if supported',
            'Configure your router to temporarily ban IPs after multiple failed attempts',
            'Implement increasing timeouts between failed authentication attempts',
            'Set up alerts for repeated failed login attempts'
        ]
    };
    
    return results;
}

/**
 * Tests if a WiFi password meets minimum complexity requirements to resist brute force
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Information about the network
 * @returns {Object} Assessment of password strength and brute force resistance
 */
function assessPasswordStrength(ssid, networkInfo) {
    console.log('Assessing password complexity and strength...');

    // EDUCATIONAL NOTE:
    // =================
    // Password strength is the primary defense against brute force attacks.
    // Even without knowing the actual password, we can estimate strength based on:
    // 1. Network encryption type (WPA3 > WPA2 > WPA > WEP)
    // 2. Whether common passwords are rejected by the router
    // 3. Whether the network has other anti-brute force measures
    //
    // Password cracking time estimates:
    // - 8 char (letters only): ~2 hours with GPU
    // - 8 char (letters+numbers): ~1 day with GPU
    // - 10 char (mixed case+numbers): ~9 years with GPU
    // - 12 char (mixed case+numbers+symbols): ~3,000 years with GPU
    //
    // WPA3 adds significant protection against offline attacks through SAE
    // (Simultaneous Authentication of Equals), making password cracking much harder.
    
    // Common weak password patterns:
    const commonPatterns = [
        "Password is same as SSID",
        "Default manufacturer password unchanged",
        "Simple number sequence appended to SSID",
        "Address or phone number used as password",
        "Common password from top 10,000 list"
    ];
    
    // In a real implementation, we would:
    // - Try a small set of extremely common passwords/SSIDs
    // - Test if password = SSID (very common weak practice)
    // - Test if password = default for known router models
    
    // For educational purposes, simulate checking against common defaults
    // by vendor if available
    let isLikelyDefaultPassword = false;
    let commonPasswordPattern = null;
    
    // Check if the vendor is known for weak default passwords
    if (networkInfo.vendor) {
        const vendorsWithWeakDefaults = ['Generic Device', 'D-Link', 'TP-Link', 'Netgear'];
        if (vendorsWithWeakDefaults.includes(networkInfo.vendor)) {
            // Simulate a 40% chance that default password is used for these vendors
            isLikelyDefaultPassword = Math.random() < 0.4;
            if (isLikelyDefaultPassword) {
                commonPasswordPattern = "Default manufacturer password unchanged";
            }
        }
    }
    
    // Check if SSID suggests weak password pattern
    if (ssid && !isLikelyDefaultPassword) {
        // Check if SSID contains common home identifiers (address, name, etc.)
        const commonIdentifiers = ['home', 'wifi', 'network', 'family', 'house'];
        const hasCommonIdentifier = commonIdentifiers.some(id => ssid.toLowerCase().includes(id));
        
        if (hasCommonIdentifier) {
            // Higher chance of weak password if SSID contains common identifier
            isLikelyDefaultPassword = Math.random() < 0.3;
            if (isLikelyDefaultPassword) {
                commonPasswordPattern = commonPatterns[Math.floor(Math.random() * (commonPatterns.length - 1))];
            }
        }
    }

    const results = {
        encryptionStrength: networkInfo.encryption || 'unknown',
        estimatedResistance: 'unknown',
        commonPasswordsRejected: !isLikelyDefaultPassword,
        estimatedCrackTime: calculateEstimatedCrackTime(networkInfo.encryption),
        potentialWeaknesses: isLikelyDefaultPassword ? [commonPasswordPattern] : [],
        riskLevel: 'UNKNOWN',
        recommendations: [
            'Use WPA3 encryption when possible',
            'Ensure password is at least 12 characters with mixed case, numbers and symbols',
            'Don\'t use network name, address, or other guessable information in password',
            'Change default passwords immediately after router setup',
            'Use a password manager to generate and store complex WiFi passwords'
        ]
    };

    // Set risk level and estimated resistance based on encryption type
    if (networkInfo.encryption === 'WPA3') {
        results.estimatedResistance = 'STRONG';
        results.riskLevel = isLikelyDefaultPassword ? 'MEDIUM' : 'LOW';
    } else if (networkInfo.encryption === 'WPA2') {
        results.estimatedResistance = isLikelyDefaultPassword ? 'WEAK' : 'MODERATE';
        results.riskLevel = isLikelyDefaultPassword ? 'HIGH' : 'MEDIUM';
    } else if (networkInfo.encryption === 'WPA') {
        results.estimatedResistance = 'WEAK';
        results.riskLevel = 'HIGH';
    } else if (networkInfo.encryption === 'WEP') {
        results.estimatedResistance = 'VERY WEAK';
        results.riskLevel = 'CRITICAL';
        results.potentialWeaknesses.push('WEP encryption can be cracked regardless of password strength');
    } else if (networkInfo.encryption === 'OPEN') {
        results.estimatedResistance = 'NONE';
        results.riskLevel = 'CRITICAL';
        results.potentialWeaknesses.push('Open network with no password protection');
    }

    return results;
}

/**
 * Calculates estimated time to crack password based on encryption type
 * 
 * @param {string} encryption - The encryption type (WPA3, WPA2, etc.)
 * @returns {string} Human-readable estimate of cracking time
 */
function calculateEstimatedCrackTime(encryption) {
    // Educational estimates - these are simplified for instructional purposes
    switch (encryption) {
        case 'WPA3':
            return 'Thousands of years with current technology';
        case 'WPA2':
            return 'Months to years (depending on password strength)';
        case 'WPA':
            return 'Days to weeks (depending on password strength)';
        case 'WEP':
            return 'Minutes to hours (regardless of password)';
        case 'OPEN':
            return 'No password to crack';
        default:
            return 'Unknown';
    }
}

/**
 * Checks if the router has lockout mechanisms for repeated failed login attempts
 * 
 * @param {Object} routerInfo - Information about the router
 * @returns {Object} Assessment of lockout protections
 */
function checkLockoutProtection(routerInfo) {
    console.log('Checking for lockout mechanisms...');

    // EDUCATIONAL NOTE:
    // =================
    // Lockout mechanisms temporarily block all connection attempts after
    // a certain number of failed attempts, making brute force attacks 
    // impractically time-consuming.
    //
    // While rate limiting slows down attempts, lockout mechanisms completely
    // block further attempts for a period of time. For example:
    // - After 5 failed attempts, block for 5 minutes
    // - After 10 failed attempts, block for 30 minutes
    // - After 15 failed attempts, block for 24 hours or require admin reset
    //
    // Sophisticated lockout systems may also:
    // - Block specific devices by MAC address
    // - Alert administrators via email or app
    // - Require a secondary auth factor to unblock
    // - Implement progressive lockout times (longer with each violation)

    // Simulate lockout testing
    // In a real implementation, this would involve trying multiple failed
    // connections and checking if we're completely locked out

    // For educational purposes, simulate based on vendor if available
    let hasLockoutProtection = false;
    let lockoutThreshold = 0;
    let lockoutDurationMinutes = 0;
    
    if (routerInfo && routerInfo.vendor) {
        // Set better defaults for certain vendors known to implement lockout
        const vendorsWithGoodLockout = ['Cisco', 'Apple'];
        const vendorsWithModerateLockout = ['Netgear', 'ASUS'];
        
        if (vendorsWithGoodLockout.includes(routerInfo.vendor)) {
            hasLockoutProtection = Math.random() < 0.8; // 80% chance
            lockoutThreshold = hasLockoutProtection ? Math.floor(Math.random() * 3) + 3 : 0; // 3-5
            lockoutDurationMinutes = hasLockoutProtection ? Math.floor(Math.random() * 15) + 15 : 0; // 15-30 min
        } else if (vendorsWithModerateLockout.includes(routerInfo.vendor)) {
            hasLockoutProtection = Math.random() < 0.5; // 50% chance
            lockoutThreshold = hasLockoutProtection ? Math.floor(Math.random() * 5) + 5 : 0; // 5-10
            lockoutDurationMinutes = hasLockoutProtection ? Math.floor(Math.random() * 10) + 5 : 0; // 5-15 min
        } else {
            hasLockoutProtection = Math.random() < 0.3; // 30% chance
            lockoutThreshold = hasLockoutProtection ? Math.floor(Math.random() * 10) + 10 : 0; // 10-20
            lockoutDurationMinutes = hasLockoutProtection ? Math.floor(Math.random() * 5) + 1 : 0; // 1-5 min
        }
    } else {
        // Generic case without vendor info
        hasLockoutProtection = Math.random() < 0.4; // 40% chance
        lockoutThreshold = hasLockoutProtection ? Math.floor(Math.random() * 5) + 5 : 0; // 5-10
        lockoutDurationMinutes = hasLockoutProtection ? Math.floor(Math.random() * 15) + 5 : 0; // 5-20 min
    }
    
    // Calculate risk level based on protection
    let riskLevel = 'HIGH';
    if (hasLockoutProtection) {
        if (lockoutThreshold <= 5 && lockoutDurationMinutes >= 15) {
            riskLevel = 'LOW';
        } else if (lockoutThreshold <= 10 && lockoutDurationMinutes >= 5) {
            riskLevel = 'MEDIUM';
        } else {
            riskLevel = 'MEDIUM-HIGH';
        }
    }

    const results = {
        hasLockoutProtection,
        lockoutThreshold,
        lockoutDurationMinutes,
        riskLevel,
        effectivenessRating: calculateLockoutEffectiveness(lockoutThreshold, lockoutDurationMinutes),
        recommendations: [
            'Enable temporary lockout after failed attempts in router settings',
            'Configure admin notifications for repeated failed attempts',
            'Set lockout threshold to 5 or fewer attempts',
            'Set lockout duration to at least 15 minutes',
            'Enable progressive lockout (increasing duration with repeated violations)'
        ]
    };

    return results;
}

/**
 * Calculate the effectiveness of lockout settings
 * 
 * @param {number} threshold - Number of attempts before lockout
 * @param {number} duration - Lockout duration in minutes
 * @returns {string} Effectiveness rating
 */
function calculateLockoutEffectiveness(threshold, duration) {
    if (threshold === 0 || duration === 0) return 'None';
    
    if (threshold <= 3 && duration >= 30) return 'Excellent';
    if (threshold <= 5 && duration >= 15) return 'Good';
    if (threshold <= 10 && duration >= 5) return 'Moderate';
    return 'Minimal';
}

/**
 * Comprehensive test suite for brute force resistance
 * 
 * @param {Object} network - Network information object
 * @param {Object} router - Router information if available
 * @returns {Object} Complete brute force protection assessment
 */
async function assessBruteForceProtection(network, router = {}) {
    console.log(`Assessing brute force protection for network: ${network.ssid}`);

    const rateLimitingResult = await checkRateLimiting(network.interface);
    const passwordStrengthResult = assessPasswordStrength(network.ssid, network);
    const lockoutProtectionResult = checkLockoutProtection(router);
    
    // For educational content, we'll just use hardcoded values for now
    // This avoids module-related issues
    const educationalContent = {
        passwordInfo: {
            overview: 'Password strength is the primary defense against brute force attacks',
            recommendations: [
                'Use passwords at least 12 characters long',
                'Include uppercase, lowercase, numbers, and symbols',
                'Avoid common words and patterns'
            ]
        },
        bruteForceInfo: {
            name: 'Brute Force Protection',
            description: 'Defense against automated password guessing',
            recommendations: [
                'Enable router rate limiting',
                'Use WPA3 when available',
                'Implement account lockout mechanisms'
            ]
        },
        encryptionInfo: {
            types: ['WEP', 'WPA', 'WPA2', 'WPA3'],
            recommended: 'WPA3'
        }
    }

    return {
        ssid: network.ssid,
        macAddress: network.macAddress,
        bruteForceProtection: {
            overallRating: calculateOverallRating(
                rateLimitingResult, 
                passwordStrengthResult, 
                lockoutProtectionResult
            ),
            rateLimiting: rateLimitingResult,
            passwordStrength: passwordStrengthResult,
            lockoutProtection: lockoutProtectionResult,
            vulnerabilities: identifyVulnerabilities(
                rateLimitingResult, 
                passwordStrengthResult, 
                lockoutProtectionResult
            ),
            recommendations: generateRecommendations(
                rateLimitingResult, 
                passwordStrengthResult, 
                lockoutProtectionResult
            ),
            educationalContent: {
                passwordStrengthInfo: educationalContent.passwordInfo,
                bruteForceAttackInfo: educationalContent.bruteForceInfo,
                encryptionInfo: educationalContent.encryptionInfo
            }
        }
    };
}

/**
 * Calculate overall brute force protection rating based on individual tests
 * 
 * @param {Object} rateLimitingResult - Rate limiting test results
 * @param {Object} passwordStrengthResult - Password strength assessment
 * @param {Object} lockoutProtectionResult - Lockout protection test results
 * @returns {string} Overall rating (LOW, MEDIUM, HIGH, CRITICAL)
 */
function calculateOverallRating(rateLimitingResult, passwordStrengthResult, lockoutProtectionResult) {
    // Logic to determine overall rating based on component ratings
    // This is a simplified version - production code would have more sophisticated logic
    
    const riskLevels = [
        passwordStrengthResult.riskLevel, 
        rateLimitingResult.riskLevel,
        lockoutProtectionResult.riskLevel
    ];
    
    if (riskLevels.includes('CRITICAL')) return 'CRITICAL';
    if (riskLevels.includes('HIGH')) return 'HIGH';
    if (riskLevels.includes('MEDIUM')) return 'MEDIUM';
    return 'LOW';
}

/**
 * Identify specific vulnerabilities based on test results
 * 
 * @param {Object} rateLimitingResult - Rate limiting test results
 * @param {Object} passwordStrengthResult - Password strength assessment
 * @param {Object} lockoutProtectionResult - Lockout protection test results
 * @returns {Array} List of identified vulnerabilities
 */
function identifyVulnerabilities(rateLimitingResult, passwordStrengthResult, lockoutProtectionResult) {
    const vulnerabilities = [];
    
    if (!rateLimitingResult.hasRateLimiting) {
        vulnerabilities.push({
            name: 'No Rate Limiting',
            description: 'Your network does not limit the rate of connection attempts, allowing attackers to rapidly try multiple passwords.',
            severity: 'HIGH'
        });
    }
    
    if (passwordStrengthResult.riskLevel === 'HIGH') {
        vulnerabilities.push({
            name: 'Weak Password Protection',
            description: `Network uses ${passwordStrengthResult.encryptionStrength} encryption which may be vulnerable to password cracking.`,
            severity: 'HIGH'
        });
    }
    
    if (!lockoutProtectionResult.hasLockoutProtection) {
        vulnerabilities.push({
            name: 'No Lockout Protection',
            description: 'Your router does not temporarily lock out after repeated failed login attempts.',
            severity: 'MEDIUM'
        });
    }
    
    return vulnerabilities;
}

/**
 * Generate recommendations to improve brute force protection
 * 
 * @param {Object} rateLimitingResult - Rate limiting test results
 * @param {Object} passwordStrengthResult - Password strength assessment
 * @param {Object} lockoutProtectionResult - Lockout protection test results
 * @returns {Array} List of recommendations
 */
function generateRecommendations(rateLimitingResult, passwordStrengthResult, lockoutProtectionResult) {
    // Combine all recommendations from individual tests and remove duplicates
    const allRecommendations = [
        ...rateLimitingResult.recommendations,
        ...passwordStrengthResult.recommendations,
        ...lockoutProtectionResult.recommendations
    ];
    
    return [...new Set(allRecommendations)];
}

/**
 * Simulate a brute force attack to demonstrate the importance of strong passwords
 * This is for educational purposes only and does not perform any actual attack
 * 
 * @param {string} encryption - The encryption type (WPA3, WPA2, etc)
 * @param {Object} options - Optional parameters for simulation
 * @returns {Object} Simulation results with educational metrics
 */
function simulateBruteForceAttack(encryption, options = {}) {
    console.log('Simulating hypothetical brute force attack (educational demonstration)...');
    
    // Default options
    const config = {
        passwordLength: options.passwordLength || 8,
        passwordComplexity: options.passwordComplexity || 'medium', // low, medium, high
        attemptsPerSecond: options.attemptsPerSecond || calculateAttemptsPerSecond(encryption),
        timeLimit: options.timeLimit || 3600, // Limit simulation to 1 hour in seconds
        ...options
    };
    
    // Calculate password strength metrics
    const charsetSize = getCharsetSize(config.passwordComplexity);
    const passwordSpace = Math.pow(charsetSize, config.passwordLength);
    const secondsNeeded = passwordSpace / config.attemptsPerSecond;
    const attackFeasibility = assessAttackFeasibility(secondsNeeded);
    
    // Create a hypothetical progress visualization
    const progressData = generateProgressVisualization(secondsNeeded, config.timeLimit);
    
    return {
        encryption,
        passwordMetrics: {
            estimatedLength: config.passwordLength,
            estimatedComplexity: config.passwordComplexity,
            possibleCombinations: passwordSpace.toExponential(2),
            charsetSize,
        },
        attackSimulation: {
            attemptsPerSecond: config.attemptsPerSecond.toLocaleString(),
            estimatedTimeToBreak: formatTimeEstimate(secondsNeeded),
            feasibilityAssessment: attackFeasibility,
            progressAfterOneHour: progressData.progressPercentage.toFixed(8) + '%',
            progressVisualization: progressData.visualization,
        },
        educationalTakeaways: [
            `Adding just 2 more characters to your password would increase cracking time by ${charsetSize}² (${Math.pow(charsetSize, 2).toLocaleString()}) times`,
            `Using a more complex character set with symbols and numbers can increase security significantly`,
            `${encryption === 'WPA3' ? 'WPA3 provides additional protections against offline attacks, making brute forcing much harder' : 'WPA3 would provide better protection against this type of attack'}`,
            `Passwords shorter than 12 characters should be considered vulnerable regardless of complexity`
        ]
    };
}

/**
 * Calculate realistic attempts per second by encryption type
 */
function calculateAttemptsPerSecond(encryption) {
    // Educational estimates based on current hardware capabilities
    // Actual values would vary by hardware and attack method
    switch (encryption) {
        case 'WPA3':
            return 100; // Dramatically reduced due to SAE protection
        case 'WPA2':
            return 20000; // Much slower due to PBKDF2 hash function
        case 'WPA':
            return 50000;
        case 'WEP':
            return 1000000; // WEP is fundamentally broken
        default:
            return 10000;
    }
}

/**
 * Get charset size based on password complexity
 */
function getCharsetSize(complexity) {
    switch (complexity.toLowerCase()) {
        case 'high': // a-z, A-Z, 0-9, symbols
            return 95;
        case 'medium': // a-z, A-Z, 0-9
            return 62;
        case 'low': // a-z, 0-9
            return 36;
        default: // a-z only
            return 26;
    }
}

/**
 * Assess attack feasibility based on time needed
 */
function assessAttackFeasibility(secondsNeeded) {
    if (secondsNeeded < 3600) { // Less than 1 hour
        return 'CRITICAL - Password can be broken in less than an hour';
    } else if (secondsNeeded < 86400) { // Less than 1 day
        return 'HIGH RISK - Password can be broken in less than a day';
    } else if (secondsNeeded < 604800) { // Less than 1 week
        return 'RISKY - Password can be broken in less than a week';
    } else if (secondsNeeded < 2592000) { // Less than 30 days
        return 'MODERATE - Password would take up to a month to break';
    } else if (secondsNeeded < 31536000) { // Less than 1 year
        return 'LOW RISK - Password would take months to break';
    } else if (secondsNeeded < 315360000) { // Less than 10 years
        return 'STRONG - Password would take years to break';
    } else {
        return 'VERY STRONG - Password would take decades to break';
    }
}

/**
 * Format time estimate in a human-readable way
 */
function formatTimeEstimate(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(1)} seconds`;
    } else if (seconds < 3600) {
        return `${(seconds / 60).toFixed(1)} minutes`;
    } else if (seconds < 86400) {
        return `${(seconds / 3600).toFixed(1)} hours`;
    } else if (seconds < 604800) {
        return `${(seconds / 86400).toFixed(1)} days`;
    } else if (seconds < 2592000) {
        return `${(seconds / 604800).toFixed(1)} weeks`;
    } else if (seconds < 31536000) {
        return `${(seconds / 2592000).toFixed(1)} months`;
    } else if (seconds < 315360000) {
        return `${(seconds / 31536000).toFixed(1)} years`;
    } else {
        return `${(seconds / 315360000).toFixed(1)} decades`;
    }
}

/**
 * Generate a visual representation of attack progress for educational purposes
 */
function generateProgressVisualization(totalSeconds, timeLimit) {
    // Cap the timeLimit to avoid visualization of extremely long processes
    const effectiveTimeLimit = Math.min(timeLimit, 3600); // Max 1 hour
    
    // Calculate progress percentage
    const elapsedTime = effectiveTimeLimit;
    const progressPercentage = (elapsedTime / totalSeconds) * 100;
    
    // Cap percentage at 100% for visualization
    const cappedPercentage = Math.min(progressPercentage, 100);
    
    // Create visualization bar
    const barLength = 30;
    const filledBars = Math.floor((cappedPercentage / 100) * barLength);
    const emptyBars = barLength - filledBars;
    
    const visualization = `[${'#'.repeat(filledBars)}${'-'.repeat(emptyBars)}] ${cappedPercentage.toFixed(2)}%`;
    
    return {
        progressPercentage,
        visualization
    };
}

module.exports = {
    assessBruteForceProtection,
    checkRateLimiting,
    assessPasswordStrength,
    checkLockoutProtection,
    simulateBruteForceAttack,
    calculateEstimatedCrackTime
};
