// This file serves as an adapter for macOS-specific functionalities.
// It exports functions to interact with the macOS networking APIs.

const { exec } = require('child_process');

// Function to scan for available WiFi networks
function scanNetworks() {
    return new Promise((resolve, reject) => {
        exec('airport -s', (error, stdout, stderr) => {
            if (error) {
                reject(`Error scanning networks: ${stderr}`);
                return;
            }
            const networks = parseScanResults(stdout);
            resolve(networks);
        });
    });
}

// Function to parse the scan results from the command line output
function parseScanResults(output) {
    const lines = output.trim().split('\n');
    const networks = lines.slice(1).map(line => {
        const parts = line.split(/\s+/);
        return {
            ssid: parts[0],
            bssid: parts[1],
            signal: parts[2],
            channel: parts[3],
            security: parts[4] || 'None'
        };
    });
    return networks;
}

// Exporting the functions for use in other parts of the application
module.exports = {
    scanNetworks
};