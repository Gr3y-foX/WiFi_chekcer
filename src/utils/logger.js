// filepath: /wifi-vulnerability-scanner/wifi-vulnerability-scanner/src/utils/logger.js

// This file provides logging functionalities for the application.
// It exports functions for logging messages and errors.

const log = (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
};

const error = (message) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
};

const warn = (message) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
};

const debug = (message) => {
    if (process.env.DEBUG) {
        console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
};

export { log, error, warn, debug };