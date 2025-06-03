// filepath: /wifi-vulnerability-scanner/wifi-vulnerability-scanner/src/core/utils.js

// Utility functions for the WiFi vulnerability scanner application

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
 * Logs a message to the console.
 * @param {string} message - The message to log.
 */
function logMessage(message) {
    console.log(message);
}

// Exporting utility functions
export { formatErrorMessage, isValidIP, logMessage };