/**
 * WiFi Vulnerability Scanner - Permissions Module
 * 
 * Handles permissions checks and requests for network scanning capabilities.
 * Different systems require different permission handling, especially for
 * accessing WiFi and network interfaces.
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const logger = require('./logger');
const os = require('os');

/**
 * Check if the necessary permissions are available
 * 
 * @returns {Promise<boolean>} True if permissions are granted, otherwise false
 */
async function checkPermissions() {
    logger.debug('Checking for network scanning permissions');
    
    const platform = os.platform();
    
    try {
        if (platform === 'darwin') { // macOS
            return await checkMacOSPermissions();
        } else if (platform === 'linux') {
            return await checkLinuxPermissions();
        } else {
            logger.warn(`Unsupported platform: ${platform}`);
            return false;
        }
    } catch (error) {
        logger.error('Error checking permissions', error);
        return false;
    }
}

/**
 * Request necessary permissions from the user
 * 
 * @returns {Promise<boolean>} True if permissions are granted, otherwise false
 */
async function requestPermissions() {
    logger.debug('Requesting network scanning permissions');
    
    const platform = os.platform();
    
    try {
        if (platform === 'darwin') { // macOS
            return await requestMacOSPermissions();
        } else if (platform === 'linux') {
            return await requestLinuxPermissions();
        } else {
            logger.warn(`Unsupported platform: ${platform}`);
            return false;
        }
    } catch (error) {
        logger.error('Error requesting permissions', error);
        return false;
    }
}

/**
 * Check permissions on macOS systems
 * 
 * @returns {Promise<boolean>} True if permissions are available
 */
async function checkMacOSPermissions() {
    logger.debug('Checking macOS permissions');
    
    try {
        // Try to access airport utility
        const airportPath = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';
        
        // Test if we can execute the airport command
        const { stdout } = await execAsync(`${airportPath} -I`);
        
        if (stdout) {
            logger.debug('Airport utility is accessible, permissions granted');
            return true;
        }
        
        logger.warn('Unable to get WiFi information, permissions may be missing');
        return false;
    } catch (error) {
        logger.warn('Failed to check permissions on macOS', error);
        return false;
    }
}

/**
 * Check permissions on Linux systems
 * 
 * @returns {Promise<boolean>} True if permissions are available
 */
async function checkLinuxPermissions() {
    logger.debug('Checking Linux permissions');
    
    try {
        // Check for sudo or network admin capabilities
        const { stdout: whoamiOutput } = await execAsync('whoami');
        const isRoot = whoamiOutput.trim() === 'root';
        
        if (isRoot) {
            logger.debug('Running as root, permissions granted');
            return true;
        }
        
        // Try to access iwlist
        const { stdout } = await execAsync('iwlist scan 2>/dev/null | grep -q ESSID');
        
        if (stdout !== '') {
            logger.debug('Network scanning is accessible');
            return true;
        }
        
        logger.warn('Unable to scan networks, permissions may be missing');
        return false;
    } catch (error) {
        logger.warn('Failed to check permissions on Linux', error);
        return false;
    }
}

/**
 * Request permissions on macOS
 * 
 * @returns {Promise<boolean>} True if permissions were granted
 */
async function requestMacOSPermissions() {
    logger.debug('Requesting macOS permissions');
    
    try {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║               Permission Required                          ║
║                                                            ║
║ This application needs administrator access to scan WiFi   ║
║ networks and perform security checks. You will be prompted ║
║ for your password.                                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
        
        // First check if we already have permissions
        const hasPermissions = await checkMacOSPermissions();
        if (hasPermissions) {
            return true;
        }
        
        // Try to set up a symbolic link to the airport utility in /usr/local/bin for easier access
        await execAsync('sudo ln -sf /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport');
        
        // Check if the link worked
        const { stdout } = await execAsync('which airport');
        
        if (stdout && stdout.trim()) {
            logger.debug('Successfully set up airport utility');
            return true;
        }
        
        logger.warn('Failed to set up airport utility');
        return false;
    } catch (error) {
        logger.error('Failed to request permissions on macOS', error);
        
        // Even though we failed to set up the link, we can still try to use the full path
        // so we'll check if direct access works
        return await checkMacOSPermissions();
    }
}

/**
 * Request permissions on Linux
 * 
 * @returns {Promise<boolean>} True if permissions were granted
 */
async function requestLinuxPermissions() {
    logger.debug('Requesting Linux permissions');
    
    try {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║               Permission Required                          ║
║                                                            ║
║ This application needs administrator access to scan WiFi   ║
║ networks and perform security checks. You will be prompted ║
║ for your password.                                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
        
        // Check if we already have permissions
        const hasPermissions = await checkLinuxPermissions();
        if (hasPermissions) {
            return true;
        }
        
        // Try to run a simple scan with sudo to request permissions
        await execAsync('sudo -k iwlist scan');
        
        // Check if it worked
        return await checkLinuxPermissions();
    } catch (error) {
        logger.error('Failed to request permissions on Linux', error);
        return false;
    }
}

module.exports = {
    checkPermissions,
    requestPermissions
};