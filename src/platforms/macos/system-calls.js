// filepath: /wifi-vulnerability-scanner/wifi-vulnerability-scanner/src/platforms/macos/system-calls.js

// This file contains system call implementations for macOS to perform network operations.
// It exports functions for executing system commands related to WiFi.

const { exec } = require('child_process');

/**
 * Executes a system command and returns the output.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - A promise that resolves with the command output.
 */
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing command: ${stderr}`);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

/**
 * Scans for available WiFi networks using the 'airport' command.
 * @returns {Promise<Array>} - A promise that resolves with an array of available networks.
 */
async function scanWiFiNetworks() {
    const command = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s';
    const output = await executeCommand(command);
    const networks = output.split('\n').slice(1).map(line => {
        const parts = line.trim().split(/\s+/);
        return {
            ssid: parts[0],
            bssid: parts[1],
            signal: parts[2],
            channel: parts[3],
            security: parts[4],
        };
    });
    return networks;
}

/**
 * Connects to a specified WiFi network.
 * @param {string} ssid - The SSID of the network to connect to.
 * @param {string} password - The password for the network.
 * @returns {Promise<string>} - A promise that resolves with the connection status.
 */
async function connectToWiFi(ssid, password) {
    const command = `networksetup -setairportnetwork en0 "${ssid}" "${password}"`;
    return await executeCommand(command);
}

// Exporting the functions for use in other modules
module.exports = {
    scanWiFiNetworks,
    connectToWiFi,
};