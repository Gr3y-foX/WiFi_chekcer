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

/**
 * WiFi Common Password Database
 * Compiled from real-world security research and common password studies
 */
const COMMON_WIFI_PASSWORDS = {
    // Most common WiFi passwords (educational use only)
    top100: [
        'password', '12345678', 'password123', 'admin', 'qwerty123',
        'password1', '123456789', 'welcome', 'internet', 'wifi',
        'changeme', 'guest', 'letmein', 'connect', 'wireless',
        'mypassword', 'default', 'secret', '00000000', '11111111',
        'router', 'netgear', 'linksys', 'dlink', 'access',
        'security', 'network', 'home', 'family', 'private',
        'test123', 'admin123', 'root123', 'user123', 'demo123',
        'temp123', 'pass123', '1qaz2wsx', 'qwerty', 'abc123',
        'trustno1', 'monkey', 'dragon', 'mustang', 'starwars',
        'football', 'baseball', 'basketball', 'soccer', 'hockey',
        'princess', 'sunshine', 'iloveyou', 'welcome1', 'hello123',
        'computer', 'freedom', 'whatever', 'michael', 'jennifer',
        'superman', 'batman', 'master', 'jordan', 'harley',
        'robert', 'matthew', 'daniel', 'andrew', 'joshua',
        'anthony', 'william', 'david', 'richard', 'thomas',
        'charles', 'steven', 'dennis', 'joseph', 'nathan',
        'samantha', 'gregory', 'patrick', 'benjamin', 'zachary',
        'samsung', 'apple123', 'google123', 'facebook', 'twitter',
        'instagram', 'youtube', 'amazon123', 'netflix', 'spotify',
        'windows', 'microsoft', 'office365', 'outlook', 'hotmail',
        'gmail123', 'yahoo123', 'aol123', 'verizon', 'comcast',
        'spectrum', 'xfinity', 'frontier', 'centurylink', 'charter',
        'password!', 'Password1', 'Password123', 'Welcome1', 'Admin123',
        'qwertyui', 'asdfghjk', 'zxcvbnm', 'poiuytre', 'lkjhgfds',
        '123qwe', '321cba', '456def', '789ghi', '147adg'
    ],
    
    // Router-specific default passwords
    routerDefaults: {
        'Netgear': ['password', 'password1', 'admin', '1234567890', 'netgear123'],
        'Linksys': ['admin', 'password', 'linksys', '1234567890', 'cisco123'],
        'D-Link': ['admin', 'password', 'dlink', '1234567890', 'blank'],
        'TP-Link': ['admin', 'password', 'tplink', '1234567890', 'tp123'],
        'ASUS': ['admin', 'password', 'asus', '1234567890', 'router'],
        'Cisco': ['cisco', 'password', 'admin', '1234567890', 'enable'],
        'Apple': ['public', 'private', 'apple', 'airport', 'express'],
        'Belkin': ['admin', 'password', 'belkin', '1234567890', 'blank'],
        'Buffalo': ['admin', 'password', 'buffalo', 'root', '1234567890'],
        'Motorola': ['motorola', 'admin', 'password', '1234567890', 'operator']
    },
    
    // SSID-based patterns (password derived from network name)
    ssidPatterns: [
        '{ssid}', '{ssid}123', '{ssid}1', '{ssid}2023', '{ssid}2024', '{ssid}2025',
        '{ssid}!', '{ssid}password', 'password{ssid}', '{ssid}_wifi',
        '{ssid}_home', '{ssid}_guest', '{ssid}_secure', '{ssid}_admin'
    ],
    
    // Location-based common passwords
    locationBased: [
        'home123', 'house123', 'family123', 'office123', 'work123',
        'school123', 'guest123', 'visitor123', 'public123', 'cafe123',
        'restaurant', 'hotel123', 'apartment', 'building', 'room123',
        'floor123', 'unit123', 'suite123', 'lobby123', 'reception'
    ],
    
    // Year and date patterns
    datePatterns: [
        '20232023', '20242024', '20252025', '12345678', '87654321',
        '01011970', '01012000', '12311999', '06151985', '04201990',
        'january1', 'december', 'birthday', 'anniversary', 'christmas'
    ],
    
    // Company and brand names
    brandNames: [
        'google123', 'microsoft', 'facebook', 'amazon123', 'apple123',
        'samsung123', 'intel123', 'nvidia123', 'amd123', 'oracle123',
        'ibm123', 'dell123', 'hp123', 'lenovo123', 'huawei123'
    ]
};

/**
 * Password Generation Patterns
 * Based on common human password creation patterns
 */
const PASSWORD_GENERATION_PATTERNS = {
    // Common word combinations
    wordCombinations: [
        ['secure', 'wifi', 'network', 'home', 'access'],
        ['family', 'house', 'private', 'guest', 'admin'],
        ['internet', 'connect', 'online', 'digital', 'tech'],
        ['strong', 'safe', 'protected', 'locked', 'encrypted'],
        ['welcome', 'hello', 'enter', 'login', 'access']
    ],
    
    // Number patterns humans commonly use
    numberPatterns: [
        '123', '321', '456', '789', '147', '258', '369',
        '000', '111', '222', '333', '444', '555', '666', '777', '888', '999',
        '12', '21', '34', '43', '56', '65', '78', '87', '90', '09',
        '2023', '2024', '2025', '1234', '4321', '6789', '9876'
    ],
    
    // Special character patterns
    specialPatterns: [
        '!', '@', '#', '$', '%', '&', '*', '+', '=', '?',
        '!!', '@@', '##', '$$', '!@', '@#', '#$', '$%',
        '123!', '456@', '789#', '!@#', '@#$', '#$%'
    ],
    
    // Common substitutions (leet speak)
    substitutions: {
        'a': ['@', '4'], 'e': ['3'], 'i': ['1', '!'], 'o': ['0'],
        's': ['$', '5'], 't': ['7'], 'l': ['1'], 'g': ['9']
    }
};

/**
 * Enhanced password strength assessment with dictionary checking
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Information about the network
 * @param {Object} routerInfo - Router information if available
 * @returns {Object} Comprehensive assessment including dictionary check results
 */
function enhancedPasswordStrengthAssessment(ssid, networkInfo, routerInfo = null) {
    console.log('🔍 Running enhanced password strength assessment...');

    const results = {
        dictionaryResults: null,
        generatedPasswordResults: null,
        overallAssessment: null,
        recommendations: [],
        estimatedCrackTime: null,
        riskLevel: 'UNKNOWN'
    };

    // Step 1: Simulate dictionary attack with common passwords
    results.dictionaryResults = simulateDictionaryAttack(ssid, networkInfo, routerInfo);
    
    // Step 2: Simulate intelligent password generation attack
    results.generatedPasswordResults = simulateIntelligentPasswordGeneration(ssid, networkInfo, routerInfo);
    
    // Step 3: Combine results for overall assessment
    results.overallAssessment = combineAttackResults(results.dictionaryResults, results.generatedPasswordResults);
    
    // Step 4: Calculate risk level and recommendations
    results.riskLevel = calculateOverallRiskLevel(results.overallAssessment, networkInfo);
    results.recommendations = generateSecurityRecommendations(results.overallAssessment, networkInfo);
    results.estimatedCrackTime = calculateRealisticCrackTime(results.overallAssessment, networkInfo);

    return results;
}

/**
 * Simulates a dictionary attack using common WiFi passwords
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Network information
 * @param {Object} routerInfo - Router information
 * @returns {Object} Results of dictionary attack simulation
 */
function simulateDictionaryAttack(ssid, networkInfo, routerInfo) {
    console.log('📚 Simulating dictionary attack with common passwords...');
    
    const results = {
        testedPasswords: 0,
        potentialMatches: [],
        attackSuccess: false,
        timeToBreak: null,
        passwordCategories: {},
        vulnerablePatterns: []
    };

    // Build comprehensive password list
    let passwordList = [...COMMON_WIFI_PASSWORDS.top100];
    
    // Add router-specific defaults if vendor known
    if (routerInfo && routerInfo.vendor && COMMON_WIFI_PASSWORDS.routerDefaults[routerInfo.vendor]) {
        passwordList.push(...COMMON_WIFI_PASSWORDS.routerDefaults[routerInfo.vendor]);
        results.passwordCategories.routerDefaults = COMMON_WIFI_PASSWORDS.routerDefaults[routerInfo.vendor].length;
    }
    
    // Add SSID-based patterns
    const ssidPasswords = COMMON_WIFI_PASSWORDS.ssidPatterns.map(pattern => 
        pattern.replace('{ssid}', ssid || 'network')
    );
    passwordList.push(...ssidPasswords);
    results.passwordCategories.ssidBased = ssidPasswords.length;
    
    // Add location and date-based passwords
    passwordList.push(...COMMON_WIFI_PASSWORDS.locationBased);
    passwordList.push(...COMMON_WIFI_PASSWORDS.datePatterns);
    passwordList.push(...COMMON_WIFI_PASSWORDS.brandNames);
    
    results.passwordCategories.locationBased = COMMON_WIFI_PASSWORDS.locationBased.length;
    results.passwordCategories.dateBased = COMMON_WIFI_PASSWORDS.datePatterns.length;
    results.passwordCategories.brandBased = COMMON_WIFI_PASSWORDS.brandNames.length;
    
    // Remove duplicates and count
    passwordList = [...new Set(passwordList)];
    results.testedPasswords = passwordList.length;
    
    // Simulate testing (educational - we don't actually test passwords)
    // Instead, we analyze patterns that would be vulnerable
    
    // Enhanced vulnerability simulation with more realistic "cracked" passwords
    const crackedPasswords = [];
    
    // Check for vulnerable patterns based on SSID
    if (ssid) {
        const vulnerableSSIDPatterns = [
            ssid.toLowerCase(),
            ssid.toLowerCase() + '123',
            ssid.toLowerCase() + '1',
            ssid.toLowerCase() + '2024',
            ssid.toLowerCase() + '2025',
            'password' + ssid.toLowerCase(),
            ssid.toLowerCase() + 'wifi',
            ssid.toLowerCase() + 'password',
            ssid.toLowerCase() + '!',
            ssid.toLowerCase() + '@'
        ];
        
        vulnerableSSIDPatterns.forEach(pattern => {
            if (passwordList.includes(pattern)) {
                const crackedPassword = {
                    password: pattern,
                    category: 'SSID-based',
                    risk: 'HIGH',
                    reason: 'Password derived from network name',
                    crackedIn: Math.floor(Math.random() * 30) + 1, // 1-30 seconds
                    attempts: Math.floor(Math.random() * 1000) + 1
                };
                results.potentialMatches.push(crackedPassword);
                crackedPasswords.push(crackedPassword);
                results.vulnerablePatterns.push(`SSID-based pattern: ${pattern}`);
            }
        });
    }
    
    // Check for router vendor default passwords
    if (routerInfo && routerInfo.vendor && COMMON_WIFI_PASSWORDS.routerDefaults[routerInfo.vendor]) {
        const vendorDefaults = COMMON_WIFI_PASSWORDS.routerDefaults[routerInfo.vendor];
        // Simulate 60% chance of finding a default password
        if (Math.random() < 0.6) {
            const defaultPassword = vendorDefaults[Math.floor(Math.random() * vendorDefaults.length)];
            const crackedDefault = {
                password: defaultPassword,
                category: 'Router Default',
                risk: 'CRITICAL',
                reason: `Common ${routerInfo.vendor} default password`,
                crackedIn: Math.floor(Math.random() * 10) + 1, // 1-10 seconds
                attempts: Math.floor(Math.random() * 50) + 1
            };
            results.potentialMatches.push(crackedDefault);
            crackedPasswords.push(crackedDefault);
        }
    }
    
    // Check for common weak passwords
    const commonWeakPasswords = ['password', '12345678', 'password123', 'admin', 'qwerty123'];
    // Simulate 30% chance of finding a common weak password
    if (Math.random() < 0.3) {
        const weakPassword = commonWeakPasswords[Math.floor(Math.random() * commonWeakPasswords.length)];
        const crackedWeak = {
            password: weakPassword,
            category: 'Common Weak',
            risk: 'CRITICAL',
            reason: 'Top 100 most common passwords',
            crackedIn: Math.floor(Math.random() * 5) + 1, // 1-5 seconds
            attempts: Math.floor(Math.random() * 25) + 1
        };
        results.potentialMatches.push(crackedWeak);
        crackedPasswords.push(crackedWeak);
    }
    
    // Store successful cracks for display
    results.successfulCracks = crackedPasswords;
    
    // Simulate realistic attack timing
    // Real dictionary attacks can test 1000-10000 passwords per second depending on encryption
    const attackSpeedPerSecond = networkInfo.encryption === 'WPA3' ? 100 : 
                                networkInfo.encryption === 'WPA2' ? 1000 : 
                                networkInfo.encryption === 'WPA' ? 5000 : 10000;
    
    results.timeToBreak = Math.ceil(results.testedPasswords / attackSpeedPerSecond);
    
    // Determine if attack would likely succeed
    results.attackSuccess = results.potentialMatches.length > 0 || 
                           (networkInfo.encryption === 'WEP' || networkInfo.encryption === 'OPEN');
    
    return results;
}

/**
 * Simulates intelligent password generation based on common patterns
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Network information
 * @param {Object} routerInfo - Router information
 * @returns {Object} Results of intelligent generation attack
 */
function simulateIntelligentPasswordGeneration(ssid, networkInfo, routerInfo) {
    console.log('🧠 Simulating intelligent password generation attack...');
    
    const results = {
        generatedPasswords: 0,
        generationStrategies: [],
        estimatedSuccessRate: 0,
        timeToGenerate: 0,
        patternAnalysis: {},
        potentialWeaknesses: []
    };

    // Strategy 1: Word combination generation
    const wordCombinations = generateWordCombinations(ssid, routerInfo);
    results.generationStrategies.push({
        name: 'Word Combinations',
        count: wordCombinations.length,
        examples: wordCombinations.slice(0, 5),
        successRate: 15 // 15% estimated success rate
    });

    // Strategy 2: Pattern-based generation
    const patternPasswords = generatePatternBasedPasswords(ssid, networkInfo);
    results.generationStrategies.push({
        name: 'Pattern-Based',
        count: patternPasswords.length,
        examples: patternPasswords.slice(0, 5),
        successRate: 25 // 25% estimated success rate
    });

    // Strategy 3: Hybrid approaches
    const hybridPasswords = generateHybridPasswords(ssid, networkInfo, routerInfo);
    results.generationStrategies.push({
        name: 'Hybrid Generation',
        count: hybridPasswords.length,
        examples: hybridPasswords.slice(0, 5),
        successRate: 35 // 35% estimated success rate
    });

    // Calculate totals
    results.generatedPasswords = results.generationStrategies.reduce((sum, strategy) => sum + strategy.count, 0);
    results.estimatedSuccessRate = Math.max(...results.generationStrategies.map(s => s.successRate));
    
    // Simulate successful cracks from generated passwords
    results.successfulGeneratedCracks = [];
    
    // Simulate finding weak patterns in generated passwords
    if (results.estimatedSuccessRate > 25) {
        const crackedGenerated = [];
        
        // Simulate cracking SSID-based generated passwords
        if (ssid) {
            const ssidBasedCracks = [
                `${ssid.toLowerCase()}2025`,
                `${ssid.toLowerCase()}home`,
                `${ssid.toLowerCase()}wifi123`,
                `secure${ssid.toLowerCase()}`,
                `${ssid.toLowerCase()}@home`
            ];
            
            ssidBasedCracks.forEach((password, index) => {
                if (index < 2) { // Limit to 2 examples
                    crackedGenerated.push({
                        password: password,
                        category: 'Generated Pattern',
                        method: 'SSID + Common Pattern',
                        crackedIn: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
                        attempts: Math.floor(Math.random() * 10000) + 1000,
                        reason: 'Predictable pattern based on network name'
                    });
                }
            });
        }
        
        // Simulate cracking vendor-based patterns
        if (routerInfo && routerInfo.vendor) {
            const vendorCracks = [
                `${routerInfo.vendor.toLowerCase()}home25`,
                `${routerInfo.vendor.toLowerCase()}2025!`,
                `secure${routerInfo.vendor.toLowerCase()}`
            ];
            
            vendorCracks.forEach((password, index) => {
                if (index < 1) { // Limit to 1 example
                    crackedGenerated.push({
                        password: password,
                        category: 'Generated Pattern',
                        method: 'Vendor + Pattern',
                        crackedIn: Math.floor(Math.random() * 600) + 120, // 2-10 minutes
                        attempts: Math.floor(Math.random() * 50000) + 5000,
                        reason: 'Pattern based on router vendor'
                    });
                }
            });
        }
        
        results.successfulGeneratedCracks = crackedGenerated;
    }
    
    // Estimate generation time (modern GPUs can generate millions per second)
    results.timeToGenerate = Math.ceil(results.generatedPasswords / 100000); // seconds
    
    // Analyze patterns for weaknesses
    results.patternAnalysis = analyzePasswordPatterns(ssid, networkInfo);
    
    return results;
}

/**
 * Generates word-based password combinations
 * 
 * @param {string} ssid - Network name
 * @param {Object} routerInfo - Router information
 * @returns {Array} Generated password combinations
 */
function generateWordCombinations(ssid, routerInfo) {
    const passwords = [];
    const baseWords = ['wifi', 'home', 'network', 'secure', 'access', 'connect'];
    
    // Add SSID-derived words
    if (ssid) {
        baseWords.push(ssid.toLowerCase());
    }
    
    // Add vendor-specific words
    if (routerInfo && routerInfo.vendor) {
        baseWords.push(routerInfo.vendor.toLowerCase());
    }
    
    // Generate combinations
    baseWords.forEach(word1 => {
        baseWords.forEach(word2 => {
            if (word1 !== word2) {
                // Two-word combinations
                passwords.push(word1 + word2);
                passwords.push(word1 + word2 + '123');
                passwords.push(word1 + word2 + '!');
                
                // With separators
                passwords.push(word1 + '_' + word2);
                passwords.push(word1 + '-' + word2);
                passwords.push(word1 + '@' + word2);
            }
        });
        
        // Single word with patterns
        PASSWORD_GENERATION_PATTERNS.numberPatterns.forEach(number => {
            passwords.push(word1 + number);
            passwords.push(number + word1);
        });
        
        PASSWORD_GENERATION_PATTERNS.specialPatterns.forEach(special => {
            passwords.push(word1 + special);
            passwords.push(special + word1);
        });
    });
    
    return [...new Set(passwords)]; // Remove duplicates
}

/**
 * Generates pattern-based passwords following human creation patterns
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Network information
 * @returns {Array} Generated pattern-based passwords
 */
function generatePatternBasedPasswords(ssid, networkInfo) {
    const passwords = [];
    
    // 16-character password generation patterns
    const patterns = [
        // Pattern: Word + Numbers + Special + Padding
        (base) => base + '2025' + '!' + ''.padEnd(16 - base.length - 5, '0'),
        (base) => base + '123456' + '@' + ''.padEnd(16 - base.length - 7, 'x'),
        (base) => base + 'Pass' + '2025' + '!' + ''.padEnd(16 - base.length - 9, '1'),
        
        // Pattern: Repeated elements
        (base) => (base + base).substr(0, 12) + '2025',
        (base) => base + (base + '123').substr(0, 16 - base.length),
        
        // Pattern: Common human substitutions
        (base) => applyLeetSpeak(base) + '123456',
        (base) => base.toUpperCase() + base.toLowerCase(),
        
        // Pattern: Keyboard patterns
        (base) => base + 'qwerty123456'.substr(0, 16 - base.length),
        (base) => base + 'asdfgh123456'.substr(0, 16 - base.length),
        
        // Pattern: Date and location combinations
        (base) => base + new Date().getFullYear() + 'HOME',
        (base) => base + 'Family' + '2025' + '!',
    ];
    
    const baseWords = [ssid || 'WiFi', 'Home', 'Secure', 'Network', 'Router'];
    
    baseWords.forEach(base => {
        patterns.forEach(pattern => {
            try {
                const generated = pattern(base);
                if (generated.length <= 16) {
                    passwords.push(generated);
                }
            } catch (e) {
                // Skip invalid patterns
            }
        });
    });
    
    return [...new Set(passwords)];
}

/**
 * Applies leet speak substitutions to a word
 * 
 * @param {string} word - Word to transform
 * @returns {string} Leet speak version
 */
function applyLeetSpeak(word) {
    let result = word.toLowerCase();
    Object.entries(PASSWORD_GENERATION_PATTERNS.substitutions).forEach(([letter, replacements]) => {
        const replacement = replacements[Math.floor(Math.random() * replacements.length)];
        result = result.replace(new RegExp(letter, 'g'), replacement);
    });
    return result;
}

/**
 * Generates hybrid passwords combining multiple strategies
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Network information
 * @param {Object} routerInfo - Router information
 * @returns {Array} Generated hybrid passwords
 */
function generateHybridPasswords(ssid, networkInfo, routerInfo) {
    const passwords = [];
    
    // Combine SSID with common patterns for 16-character passwords
    const base = ssid || 'Network';
    
    // Strategy: Padding with meaningful content
    const paddingWords = ['Secure', 'Safe', 'Home', 'WiFi', 'Access'];
    paddingWords.forEach(padding => {
        const combined = base + padding;
        if (combined.length < 16) {
            // Fill to 16 characters with numbers/symbols
            const remaining = 16 - combined.length;
            passwords.push(combined + '2025'.repeat(Math.ceil(remaining / 4)).substr(0, remaining));
            passwords.push(combined + '123!'.repeat(Math.ceil(remaining / 4)).substr(0, remaining));
            passwords.push(combined + 'abcd'.repeat(Math.ceil(remaining / 4)).substr(0, remaining));
        }
    });
    
    // Strategy: Vendor + Location + Year patterns
    if (routerInfo && routerInfo.vendor) {
        const vendor = routerInfo.vendor;
        passwords.push((vendor + 'HomeNetwork25').substr(0, 16));
        passwords.push((vendor + 'Office2025!!').substr(0, 16));
        passwords.push((base + vendor + '2025').substr(0, 16));
    }
    
    // Strategy: Keyboard walk patterns extended to 16 chars
    const keyboardPatterns = ['qwertyuiopasdfgh', 'asdfghjklzxcvbnm', '1234567890qwerty'];
    keyboardPatterns.forEach(pattern => {
        passwords.push(pattern);
        passwords.push(pattern.toUpperCase());
        passwords.push(capitalizeFirst(pattern));
    });
    
    // Strategy: Common phrases extended
    const phrases = ['ilovemyfamily16', 'securenetwork25', 'homeinternetok', 'familywifipass'];
    passwords.push(...phrases);
    
    return [...new Set(passwords)];
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Analyzes password patterns for potential weaknesses
 * 
 * @param {string} ssid - Network name
 * @param {Object} networkInfo - Network information
 * @returns {Object} Pattern analysis results
 */
function analyzePasswordPatterns(ssid, networkInfo) {
    return {
        ssidBasedVulnerability: ssid ? 'HIGH' : 'LOW',
        commonPatternRisk: 'MEDIUM',
        dictionaryWordRisk: 'HIGH',
        keyboardPatternRisk: 'MEDIUM',
        datePatternRisk: 'HIGH',
        lengthAdequacy: 'DEPENDS_ON_COMPLEXITY',
        overallPatternWeakness: 'MODERATE_TO_HIGH'
    };
}

/**
 * Combines results from dictionary and generation attacks
 * 
 * @param {Object} dictionaryResults - Dictionary attack results
 * @param {Object} generationResults - Generation attack results
 * @returns {Object} Combined assessment
 */
function combineAttackResults(dictionaryResults, generationResults) {
    return {
        totalPasswordsTested: dictionaryResults.testedPasswords + generationResults.generatedPasswords,
        combinedSuccessRate: Math.max(
            dictionaryResults.attackSuccess ? 90 : 20,
            generationResults.estimatedSuccessRate
        ),
        fastestAttackVector: dictionaryResults.timeToBreak < generationResults.timeToGenerate ? 
            'Dictionary Attack' : 'Intelligent Generation',
        vulnerabilityLevel: dictionaryResults.potentialMatches.length > 0 ? 'HIGH' : 
                           generationResults.estimatedSuccessRate > 30 ? 'MEDIUM' : 'LOW',
        recommendedDefenses: []
    };
}

/**
 * Calculates overall risk level based on all attack results
 * 
 * @param {Object} overallAssessment - Combined assessment results
 * @param {Object} networkInfo - Network information
 * @returns {string} Risk level
 */
function calculateOverallRiskLevel(overallAssessment, networkInfo) {
    if (networkInfo.encryption === 'OPEN') return 'CRITICAL';
    if (networkInfo.encryption === 'WEP') return 'CRITICAL';
    if (overallAssessment.vulnerabilityLevel === 'HIGH') return 'HIGH';
    if (networkInfo.encryption === 'WPA') return 'HIGH';
    if (overallAssessment.vulnerabilityLevel === 'MEDIUM') return 'MEDIUM';
    if (networkInfo.encryption === 'WPA2') return 'MEDIUM';
    return 'LOW';
}

/**
 * Generates security recommendations based on assessment results
 * 
 * @param {Object} overallAssessment - Combined assessment results
 * @param {Object} networkInfo - Network information
 * @returns {Array} Security recommendations
 */
function generateSecurityRecommendations(overallAssessment, networkInfo) {
    const recommendations = [];
    
    if (networkInfo.encryption === 'OPEN') {
        recommendations.push('🚨 CRITICAL: Enable WPA3 or WPA2 encryption immediately');
    }
    
    if (networkInfo.encryption === 'WEP') {
        recommendations.push('🚨 CRITICAL: Upgrade from WEP to WPA3 encryption');
    }
    
    if (overallAssessment.vulnerabilityLevel === 'HIGH') {
        recommendations.push('🔴 Use a 16+ character password with mixed case, numbers, and symbols');
        recommendations.push('🔴 Avoid passwords based on network name (SSID)');
        recommendations.push('🔴 Avoid common dictionary words and predictable patterns');
    }
    
    recommendations.push('🔵 Use WPA3 encryption if available');
    recommendations.push('🔵 Enable MAC address filtering for additional security');
    recommendations.push('🔵 Regularly update router firmware');
    recommendations.push('🔵 Use a unique password not used elsewhere');
    recommendations.push('🔵 Consider a password manager for complex passwords');
    
    if (overallAssessment.combinedSuccessRate > 50) {
        recommendations.push('⚡ Consider changing password immediately - high crack probability');
    }
    
    return recommendations;
}

/**
 * Calculates realistic crack time estimates based on current technology
 * 
 * @param {Object} overallAssessment - Combined assessment results
 * @param {Object} networkInfo - Network information
 * @returns {string} Realistic crack time estimate
 */
function calculateRealisticCrackTime(overallAssessment, networkInfo) {
    const baseTime = {
        'OPEN': 'Instant (no password)',
        'WEP': '1-10 minutes (regardless of password)',
        'WPA': '1 hour - 1 week (depending on password)',
        'WPA2': '1 day - 100 years (depending on password)',
        'WPA3': '10 years - never (with strong password)'
    };
    
    let estimate = baseTime[networkInfo.encryption] || 'Unknown';
    
    if (overallAssessment.vulnerabilityLevel === 'HIGH') {
        estimate = 'Minutes to hours (weak password detected)';
    } else if (overallAssessment.vulnerabilityLevel === 'MEDIUM') {
        estimate = 'Hours to days (moderate password strength)';
    }
    
    return estimate;
}

module.exports = {
    assessBruteForceProtection,
    checkRateLimiting,
    assessPasswordStrength,
    checkLockoutProtection,
    simulateBruteForceAttack,
    calculateEstimatedCrackTime,
    // Enhanced functions
    enhancedPasswordStrengthAssessment,
    simulateDictionaryAttack,
    simulateIntelligentPasswordGeneration,
    generateWordCombinations,
    generatePatternBasedPasswords,
    generateHybridPasswords,
    // Utility functions
    applyLeetSpeak,
    analyzePasswordPatterns,
    combineAttackResults,
    calculateOverallRiskLevel,
    generateSecurityRecommendations,
    calculateRealisticCrackTime,
    // Data exports for educational purposes
    COMMON_WIFI_PASSWORDS,
    PASSWORD_GENERATION_PATTERNS
};
