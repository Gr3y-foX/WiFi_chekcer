
/**
 * WiFi Vulnerability Scanner - Utility Functions
 * 
 * Common utilities used across the application.
 */

/**
 * Formats a given error message for display.
 * @param {string} message - The error message to format.
 * @returns {string} - The formatted error message.
 */
function formatErrorMessage(message) {
    return `Error: ${message}`;
}

/**
 * Checks if a given value is a valid IP address.
 * @param {string} ip - The IP address to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidIP(ip) {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
}

/**
 * Formats a MAC address to a standard format
 * 
 * @param {string} mac - MAC address in any format
 * @returns {string} Formatted MAC address
 */
function formatMacAddress(mac) {
    if (!mac) return '';
    
    // Remove all non-hex characters and convert to uppercase
    const cleanMac = mac.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    
    // Format as XX:XX:XX:XX:XX:XX
    const parts = [];
    for (let i = 0; i < cleanMac.length; i += 2) {
        if (i < 12) {  // MAC addresses have 12 hex chars
            parts.push(cleanMac.substring(i, i + 2));
        }
    }
    
    return parts.join(':');
}

/**
 * Converts signal strength in dBm to a human-readable quality level
 * 
 * @param {number} dBm - Signal strength in dBm
 * @returns {string} Signal quality description
 */
function signalToQuality(dBm) {
    if (dBm >= -50) return 'Excellent';
    if (dBm >= -60) return 'Good';
    if (dBm >= -70) return 'Fair';
    if (dBm >= -80) return 'Poor';
    return 'Very Poor';
}

/**
 * Safely logs messages without exposing sensitive data
 * 
 * @param {string} message - Message to log
 * @param {Object} data - Data to log (will be sanitized)
 */
function safeLog(message, data = null) {
    if (!data) {
        console.log(message);
        return;
    }
    
    // Create a safe copy of the data
    const safeCopy = { ...data };
    
    // Remove sensitive fields
    if (safeCopy.password) safeCopy.password = '********';
    if (safeCopy.credentials) safeCopy.credentials = '********';
    if (safeCopy.key) safeCopy.key = '********';
    
    console.log(message, safeCopy);
}

/**
 * Get current timestamp in a readable format
 * 
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
    return new Date().toISOString();
}

module.exports = {
    formatErrorMessage,
    isValidIP,
    formatMacAddress,
    signalToQuality,
    safeLog,
    getTimestamp
};

/**
 * Logs a message to the console.
 * @param {string} message - The message to log.
 */
function logMessage(message) {
    console.log(message);
}

// Exporting utility functions
export { formatErrorMessage, isValidIP, logMessage };