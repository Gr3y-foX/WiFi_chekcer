/**
 * WiFi Vulnerability Scanner - Logger Module
 * 
 * Provides standardized logging capabilities with different severity levels
 * and optional file logging support. Includes special handling for sensitive data.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Default log directory
const LOG_DIR = path.join(process.cwd(), 'logs');

// Log levels
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
};

// Configure current log level (can be changed at runtime)
let currentLogLevel = process.env.LOG_LEVEL ? 
    LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] : LOG_LEVELS.INFO;

// Flag to enable/disable file logging
let fileLoggingEnabled = false;
let logFilePath = null;

/**
 * Standard info log
 * 
 * @param {string} message - Message to log
 * @param {Object} data - Optional data to include
 */
const log = (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
        console.log(chalk.blue(`[INFO] ${new Date().toISOString()}:`), chalk.white(message));
        
        if (data) {
            console.log(formatData(data));
        }
        
        // Log to file if enabled
        logToFile('INFO', message, data);
    }
};

/**
 * Error logging
 * 
 * @param {string} message - Error message
 * @param {Error|Object} error - Error object or data
 */
const error = (message, error = null) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
        console.error(chalk.red(`[ERROR] ${new Date().toISOString()}:`), chalk.white(message));
        
        if (error) {
            if (error instanceof Error) {
                console.error(chalk.gray(error.stack || error.message));
            } else {
                console.error(formatData(error));
            }
        }
        
        // Log to file if enabled
        logToFile('ERROR', message, error);
    }
};

/**
 * Warning logging
 * 
 * @param {string} message - Warning message
 * @param {Object} data - Optional data
 */
const warn = (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
        console.warn(chalk.yellow(`[WARN] ${new Date().toISOString()}:`), chalk.white(message));
        
        if (data) {
            console.warn(formatData(data));
        }
        
        // Log to file if enabled
        logToFile('WARN', message, data);
    }
};

/**
 * Debug logging
 * 
 * @param {string} message - Debug message
 * @param {Object} data - Optional data
 */
const debug = (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
        console.debug(chalk.cyan(`[DEBUG] ${new Date().toISOString()}:`), chalk.white(message));
        
        if (data) {
            console.debug(formatData(data));
        }
        
        // Log to file if enabled
        logToFile('DEBUG', message, data);
    }
};

/**
 * Format data for logging, handling sensitive information
 * 
 * @param {Object} data - Data to format
 * @returns {string} Formatted data string
 */
const formatData = (data) => {
    // Create a copy to avoid modifying the original
    const sanitizedData = JSON.parse(JSON.stringify(data));
    
    // Replace sensitive fields
    sanitizeSensitiveData(sanitizedData);
    
    return JSON.stringify(sanitizedData, null, 2);
};

/**
 * Recursively sanitize sensitive fields in an object
 * 
 * @param {Object} obj - Object to sanitize
 */
const sanitizeSensitiveData = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    const sensitiveFields = ['password', 'key', 'token', 'secret', 'credentials'];
    
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeSensitiveData(obj[key]);
        } else if (sensitiveFields.includes(key.toLowerCase())) {
            obj[key] = '*****REDACTED*****';
        }
    });
};

/**
 * Log message to file if enabled
 * 
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Optional data
 */
const logToFile = (level, message, data) => {
    if (!fileLoggingEnabled || !logFilePath) return;
    
    try {
        const timestamp = new Date().toISOString();
        let logEntry = `[${level}] ${timestamp}: ${message}\n`;
        
        if (data) {
            let dataStr;
            if (data instanceof Error) {
                dataStr = data.stack || data.message;
            } else {
                dataStr = formatData(data);
            }
            logEntry += `${dataStr}\n`;
        }
        
        fs.appendFileSync(logFilePath, logEntry);
    } catch (err) {
        console.error(`Failed to write to log file: ${err.message}`);
        // Disable file logging to prevent further errors
        fileLoggingEnabled = false;
    }
};

/**
 * Enable logging to a file
 * 
 * @param {string} filePath - Path to log file (optional)
 */
const enableFileLogging = (filePath = null) => {
    try {
        // Create default log directory if not provided
        if (!filePath) {
            if (!fs.existsSync(LOG_DIR)) {
                fs.mkdirSync(LOG_DIR, { recursive: true });
            }
            
            const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/g, '');
            filePath = path.join(LOG_DIR, `wifi-scanner-${timestamp}.log`);
        }
        
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Test writing to the file
        fs.appendFileSync(filePath, `[INFO] ${new Date().toISOString()}: Logging initialized\n`);
        
        logFilePath = filePath;
        fileLoggingEnabled = true;
        
        log(`File logging enabled: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Failed to enable file logging: ${err.message}`);
        fileLoggingEnabled = false;
        return false;
    }
};

/**
 * Set the current log level
 * 
 * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR, NONE)
 */
const setLogLevel = (level) => {
    const normalizedLevel = level.toUpperCase();
    if (LOG_LEVELS.hasOwnProperty(normalizedLevel)) {
        currentLogLevel = LOG_LEVELS[normalizedLevel];
        log(`Log level set to ${normalizedLevel}`);
    } else {
        warn(`Invalid log level: ${level}. Using current level: ${
            Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === currentLogLevel)
        }`);
    }
};

module.exports = {
    log,
    error,
    warn,
    debug,
    enableFileLogging,
    setLogLevel,
    LOG_LEVELS
};

export { log, error, warn, debug };