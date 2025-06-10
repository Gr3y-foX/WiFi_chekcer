/**
 * WiFi Vulnerability Scanner - Educational Content Module
 * 
 * This module provides educational information about WiFi security threats,
 * attack vectors, and protection methods for educational purposes.
 * 
 * NOTE: This module is designed for CommonJS require() system
 */

/**
 * Provides detailed information about common WiFi attack vectors
 * 
 * @param {string} attackType - Specific attack to provide information about (optional)
 * @returns {Object|Array} Information about wifi attacks
 */
function getWifiAttackVectors(attackType = null) {
    const attackVectors = {
        'brute-force': {
            name: 'Brute Force Password Cracking',
            description: 'Automated testing of many passwords against a WiFi network until the correct one is found.',
            howItWorks: [
                'Attacker captures WPA/WPA2 handshake packets using tools like Aircrack-ng',
                'The handshake contains encrypted data that can be compared against password guesses',
                'A dictionary of common passwords or all possible combinations (brute force) is tested',
                'Modern GPUs can test thousands to millions of passwords per second'
            ],
            protection: [
                'Use a strong password with at least 12 characters including uppercase, lowercase, numbers, and symbols',
                'Consider using a passphrase of multiple random words (at least 4 words)',
                'Enable rate limiting and lockout mechanisms on your router',
                'Upgrade to WPA3 which has stronger protection against offline attacks'
            ],
            riskLevel: 'HIGH',
            technicalDetails: 'Brute force attacks against WPA2 are performed offline after capturing the 4-way handshake. ' +
                'This allows attackers to attempt password cracking without further interaction with the target network. ' +
                'The PBKDF2 key derivation function in WPA2 adds some computational cost, but not enough to protect weak passwords.'
        },
        'evil-twin': {
            name: 'Evil Twin Attack',
            description: 'Creating a rogue access point that mimics a legitimate network to trick users into connecting.',
            howItWorks: [
                'Attacker creates an access point with the same SSID as a legitimate network',
                'Legitimate network may be jammed to force devices to reconnect',
                'When users connect to the evil twin, their traffic can be monitored or modified',
                'Captive portals may ask users to "re-enter" credentials, which are stolen'
            ],
            protection: [
                'Verify network authenticity via the router\'s MAC address',
                'Use VPN connections when on public WiFi networks',
                'Enable network access control features on your network if available',
                'Check for certificate warnings in browsers and applications'
            ],
            riskLevel: 'HIGH',
            technicalDetails: 'Evil twin attacks exploit the fact that most devices automatically reconnect to known SSIDs. ' +
                'Since WiFi SSIDs are not authenticated, any device can broadcast any SSID. Advanced evil twin attacks can ' +
                'use directional antennas to provide stronger signals than legitimate access points.'
        },
        'wps-attack': {
            name: 'WPS PIN Attack',
            description: 'Exploiting vulnerabilities in WiFi Protected Setup (WPS) to recover network passwords.',
            howItWorks: [
                'WPS PINs are 8 digits, but validated in two separate groups (first 4 and last 4 digits)',
                'This reduces the complexity from 10^8 to 10^4 + 10^4 (20,000 possibilities)',
                'Tools like Reaver can automatically test all WPS PINs in a matter of hours',
                'Once the WPS PIN is discovered, the WPA/WPA2 password can be recovered'
            ],
            protection: [
                'Disable WPS on your router',
                'If WPS must be used, only use the physical push-button method',
                'Check for router firmware updates that patch WPS vulnerabilities',
                'Consider routers that implement temporary lockouts after failed PIN attempts'
            ],
            riskLevel: 'HIGH',
            technicalDetails: 'When a WPS PIN is being verified, the router responds differently depending on whether ' +
                'the first 4 digits are correct. This design flaw makes a brute force attack much more efficient. ' +
                'Additionally, many routers don\'t implement proper rate limiting for WPS attempts.'
        },
        'packet-sniffing': {
            name: 'Packet Sniffing',
            description: 'Capturing and analyzing unencrypted WiFi traffic to extract sensitive information.',
            howItWorks: [
                'Attacker places their WiFi adapter in monitor/promiscuous mode',
                'All unencrypted packets transmitted in range are collected',
                'Traffic analysis tools extract usernames, passwords, and other data',
                'Data captured can include cookies and session tokens for websites'
            ],
            protection: [
                'Only use encrypted WiFi networks (WPA2/WPA3)',
                'Ensure websites you visit use HTTPS (SSL/TLS)',
                'Use a VPN for an additional layer of encryption',
                'Avoid sending sensitive information on public WiFi networks'
            ],
            riskLevel: 'MEDIUM',
            technicalDetails: 'While WPA2/WPA3 encrypt the data between your device and the access point, ' +
                'open networks transmit all data in plain text. Even with encrypted WiFi, certain data like DNS ' +
                'requests might leak information about which websites you\'re visiting unless additional ' +
                'protection like encrypted DNS is used.'
        },
        'deauth-attack': {
            name: 'Deauthentication Attack',
            description: 'Forcing devices to disconnect from their WiFi network by sending forged deauthentication frames.',
            howItWorks: [
                'WiFi deauthentication frames are not authenticated in WPA2 and earlier',
                'Attacker sends spoofed deauth packets appearing to come from the legitimate router',
                'Connected devices interpret these as legitimate disconnect commands',
                'This can force handshake captures or redirect users to malicious networks'
            ],
            protection: [
                'Upgrade to WPA3, which protects against deauthentication attacks',
                'Use 802.11w protected management frames if available on your router',
                'Configure network monitoring to alert on deauthentication floods',
                'Be suspicious if you\'re frequently disconnected from your network'
            ],
            riskLevel: 'MEDIUM',
            technicalDetails: 'Deauthentication attacks exploit a fundamental flaw in the 802.11 protocol where ' +
                'management frames like deauth packets aren\'t authenticated until 802.11w was introduced. ' +
                'This attack can be used as a stepping stone to more serious attacks like handshake capture ' +
                'or forcing connections to an evil twin.'
        },
        'krack-attack': {
            name: 'KRACK (Key Reinstallation Attack)',
            description: 'Exploiting a vulnerability in the WPA2 handshake process to potentially decrypt encrypted traffic.',
            howItWorks: [
                'Attacker manipulates and replays cryptographic handshake messages',
                'Forces network participants to reinstall already-in-use keys',
                'This resets the encryption packet number (nonce) and receive replay counter',
                'Can allow decryption of packets and in some implementations even packet injection'
            ],
            protection: [
                'Ensure all devices are updated with security patches from October 2017 or newer',
                'Update router/access point firmware to patched versions',
                'Use HTTPS connections for important websites (adds another layer of encryption)',
                'Consider upgrading to WPA3 which is not vulnerable to KRACK'
            ],
            riskLevel: 'MEDIUM',
            technicalDetails: 'KRACK attacks the 4-way handshake of WPA2 by manipulating the third message in the ' +
                'handshake. Modern systems should be patched against this attack, but IoT devices or legacy ' +
                'systems might still be vulnerable if they haven\'t been updated since 2017.'
        }
    };
    
    // If a specific attack type is requested, return just that info
    if (attackType && attackVectors[attackType]) {
        return attackVectors[attackType];
    }
    
    // Otherwise return all attack vectors as an array
    return Object.values(attackVectors);
}

/**
 * Provides educational information about password strength
 * 
 * @returns {Object} Password strength information
 */
function getPasswordStrengthInformation() {
    return {
        overview: 'Password strength is the primary defense against brute force attacks on WiFi networks.',
        recommendations: [
            'Use passwords that are at least 12 characters long',
            'Include uppercase letters, lowercase letters, numbers, and symbols',
            'Avoid common words, phrases, or patterns',
            'Don\'t use personal information like birthdays or names',
            'Consider using a passphrase of 4+ random words instead of a complex password'
        ],
        entropyExamples: [
            { example: '123456', strength: 'Very Weak', crackTime: 'Instant', bits: 20 },
            { example: 'password', strength: 'Very Weak', crackTime: 'Instant', bits: 28 },
            { example: 'P@ssw0rd', strength: 'Weak', crackTime: 'Minutes to hours', bits: 35 },
            { example: 'TrumpPutin2024!', strength: 'Medium', crackTime: 'Weeks to months', bits: 52 },
            { example: 'correct horse battery staple', strength: 'Strong', crackTime: 'Centuries', bits: 88 },
            { example: 'X5%tQ9z#mLp!3Kw&', strength: 'Very Strong', crackTime: 'Millennia', bits: 104 }
        ],
        crackTimeFactors: [
            'Character set size (lowercase, uppercase, numbers, symbols)',
            'Password length (exponentially increases strength)',
            'Processing power of the attacker (GPUs are much faster than CPUs)',
            'Hash algorithm strength (WPA3 is more resistant than WPA2)',
            'Salt usage (prevents precomputed rainbow table attacks)'
        ],
        educationalInsight: 'For each character you add to a password, you multiply the time needed to crack it by the size of your ' +
            'character set. For example, adding one character to an all-lowercase password multiplies cracking time by 26, while adding ' +
            'one character to a password using all possible ASCII characters multiplies cracking time by 95.'
    };
}

/**
 * Provides educational information about encryption types
 * 
 * @returns {Object} Encryption comparison
 */
function getEncryptionComparison() {
    return {
        encryptionTypes: [
            {
                name: 'WEP (Wired Equivalent Privacy)',
                year: '1999',
                status: 'Broken/Deprecated',
                keyLength: '40/104 bits',
                vulnerabilities: [
                    'Weak RC4 implementation',
                    'Static encryption keys',
                    'Weak IVs (24-bit)',
                    'No message integrity'
                ],
                crackTime: 'Minutes (1-10 minutes with modern tools)',
                recommendation: 'Replace any WEP equipment immediately'
            },
            {
                name: 'WPA (WiFi Protected Access)',
                year: '2003',
                status: 'Deprecated',
                keyLength: '128 bits',
                vulnerabilities: [
                    'TKIP (based on RC4) has known weaknesses',
                    'Vulnerable to dictionary attacks',
                    'No forward secrecy',
                    'Weak packet integrity protocol (Michael)'
                ],
                crackTime: 'Hours to days',
                recommendation: 'Upgrade to WPA2 or WPA3 immediately'
            },
            {
                name: 'WPA2 (WiFi Protected Access 2)',
                year: '2004',
                status: 'Current/Being Replaced',
                keyLength: '128 bits',
                vulnerabilities: [
                    'Vulnerable to KRACK attack (when unpatched)',
                    'Vulnerable to offline dictionary attacks',
                    'Weak passwords can be brute forced',
                    'Deauthentication attacks still possible',
                    'No forward secrecy'
                ],
                crackTime: 'Depends on password (strong password: years to never; weak password: hours to days)',
                recommendation: 'Use with strong passwords (12+ random characters) and keep firmware updated'
            },
            {
                name: 'WPA3 (WiFi Protected Access 3)',
                year: '2018',
                status: 'Current/Recommended',
                keyLength: '128/192 bits',
                vulnerabilities: [
                    'Some early implementations had Dragonblood vulnerabilities (patched)',
                    'Still vulnerable to very expensive dictionary attacks (but much harder)',
                    'Side-channel attacks possible but impractical'
                ],
                crackTime: 'Significantly longer than WPA2 due to SAE (weak password: months to years; strong password: likely never)',
                recommendation: 'Recommended standard; upgrade equipment to support WPA3 when possible'
            }
        ],
        keyImprovements: [
            'WPA3 uses SAE (Simultaneous Authentication of Equals) instead of the 4-way handshake',
            'SAE provides forward secrecy (compromised passwords don\'t compromise past sessions)',
            'WPA3 includes enhanced protection against offline dictionary attacks',
            'WPA3 implements Protected Management Frames by default, preventing deauthentication attacks'
        ]
    };
}

module.exports = {
    getWifiAttackVectors,
    getPasswordStrengthInformation,
    getEncryptionComparison
};
