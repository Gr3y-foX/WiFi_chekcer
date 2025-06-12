/**
 * Linux Platform Adapter
 * 
 * Provides Linux-specific functionality for WiFi scanning and analysis.
 * Uses Linux command line tools like iwlist, nmcli, and iw to gather network information.
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;

/**
 * Scan for WiFi networks using Linux tools
 * Tries multiple methods: iwlist, nmcli, iw
 * 
 * @returns {Promise<Array>} - List of detected networks
 */
async function scanNetworks() {
    try {
        // Try iwlist first (most common)
        return await scanWithIwlist();
    } catch (error) {
        console.warn('iwlist not available, trying nmcli...');
        try {
            return await scanWithNmcli();
        } catch (nmcliError) {
            console.warn('nmcli not available, trying iw...');
            try {
                return await scanWithIw();
            } catch (iwError) {
                console.error('All WiFi scanning methods failed');
                throw new Error('No compatible WiFi scanning tools found. Please install wireless-tools, network-manager, or iw.');
            }
        }
    }
}

/**
 * Scan networks using iwlist (wireless-tools package)
 * 
 * @returns {Promise<Array>} - List of detected networks
 */
async function scanWithIwlist() {
    try {
        // First, get the wireless interface
        const interface = await getWirelessInterface();
        
        // Scan for networks
        const { stdout } = await execAsync(`iwlist ${interface} scan`);
        return parseIwlistResults(stdout);
    } catch (error) {
        throw new Error(`iwlist scan failed: ${error.message}`);
    }
}

/**
 * Scan networks using nmcli (NetworkManager)
 * 
 * @returns {Promise<Array>} - List of detected networks
 */
async function scanWithNmcli() {
    try {
        // Rescan for fresh results
        await execAsync('nmcli device wifi rescan');
        
        // Wait a moment for scan to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get scan results
        const { stdout } = await execAsync('nmcli -f SSID,BSSID,MODE,CHAN,FREQ,RATE,SIGNAL,BARS,SECURITY device wifi list');
        return parseNmcliResults(stdout);
    } catch (error) {
        throw new Error(`nmcli scan failed: ${error.message}`);
    }
}

/**
 * Scan networks using iw (newer Linux wireless utility)
 * 
 * @returns {Promise<Array>} - List of detected networks
 */
async function scanWithIw() {
    try {
        // First, get the wireless interface
        const interface = await getWirelessInterface();
        
        // Trigger scan
        await execAsync(`iw dev ${interface} scan trigger`);
        
        // Wait for scan to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get scan results
        const { stdout } = await execAsync(`iw dev ${interface} scan`);
        return parseIwResults(stdout);
    } catch (error) {
        throw new Error(`iw scan failed: ${error.message}`);
    }
}

/**
 * Get the wireless network interface name
 * 
 * @returns {Promise<string>} - Wireless interface name
 */
async function getWirelessInterface() {
    try {
        // Try to find wireless interface using multiple methods
        
        // Method 1: Check /proc/net/wireless
        try {
            const wirelessData = await fs.readFile('/proc/net/wireless', 'utf8');
            const lines = wirelessData.split('\n');
            for (const line of lines) {
                const match = line.match(/^\s*(\w+):/);
                if (match) {
                    return match[1];
                }
            }
        } catch (e) {
            // /proc/net/wireless not available
        }
        
        // Method 2: Use iwconfig
        try {
            const { stdout } = await execAsync('iwconfig 2>/dev/null');
            const match = stdout.match(/^(\w+)\s+IEEE 802\.11/m);
            if (match) {
                return match[1];
            }
        } catch (e) {
            // iwconfig not available
        }
        
        // Method 3: Use ip link show and look for wireless interfaces
        try {
            const { stdout } = await execAsync('ip link show');
            const lines = stdout.split('\n');
            for (const line of lines) {
                if (line.includes('wlan') || line.includes('wlp')) {
                    const match = line.match(/^\d+:\s+(\w+):/);
                    if (match) {
                        return match[1];
                    }
                }
            }
        } catch (e) {
            // ip command failed
        }
        
        // Default fallbacks
        const commonInterfaces = ['wlan0', 'wlp2s0', 'wlp3s0', 'wifi0'];
        for (const iface of commonInterfaces) {
            try {
                await execAsync(`iwconfig ${iface} 2>/dev/null`);
                return iface;
            } catch (e) {
                // Interface doesn't exist
            }
        }
        
        throw new Error('No wireless interface found');
    } catch (error) {
        throw new Error(`Failed to detect wireless interface: ${error.message}`);
    }
}

/**
 * Parse iwlist scan results
 * 
 * @param {string} output - Output from iwlist scan
 * @returns {Array} - Parsed network list
 */
function parseIwlistResults(output) {
    const networks = [];
    const cells = output.split('Cell ').slice(1); // Remove first empty part
    
    for (const cell of cells) {
        const network = {
            ssid: '',
            bssid: '',
            signal_level: 0,
            encryption: 'OPEN',
            channel: 0,
            frequency: ''
        };
        
        // Extract BSSID
        const bssidMatch = cell.match(/Address: ([A-Fa-f0-9:]{17})/);
        if (bssidMatch) {
            network.bssid = bssidMatch[1];
        }
        
        // Extract SSID
        const ssidMatch = cell.match(/ESSID:"([^"]*)"/);
        if (ssidMatch) {
            network.ssid = ssidMatch[1];
        }
        
        // Extract signal level
        const signalMatch = cell.match(/Signal level=(-?\d+)/);
        if (signalMatch) {
            network.signal_level = parseInt(signalMatch[1]);
        }
        
        // Extract channel
        const channelMatch = cell.match(/Channel:(\d+)/);
        if (channelMatch) {
            network.channel = parseInt(channelMatch[1]);
        }
        
        // Extract frequency
        const freqMatch = cell.match(/Frequency:([\d.]+) GHz/);
        if (freqMatch) {
            network.frequency = `${freqMatch[1]} GHz`;
        }
        
        // Determine encryption
        if (cell.includes('Encryption key:on')) {
            if (cell.includes('IEEE 802.11i/WPA2')) {
                network.encryption = 'WPA2';
            } else if (cell.includes('WPA')) {
                network.encryption = 'WPA';
            } else {
                network.encryption = 'WEP';
            }
        }
        
        // Only add networks with SSID
        if (network.ssid) {
            networks.push(network);
        }
    }
    
    return networks;
}

/**
 * Parse nmcli scan results
 * 
 * @param {string} output - Output from nmcli
 * @returns {Array} - Parsed network list
 */
function parseNmcliResults(output) {
    const networks = [];
    const lines = output.split('\n').slice(1); // Skip header
    
    for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.split(/\s{2,}/); // Split on multiple spaces
        if (parts.length >= 7) {
            const network = {
                ssid: parts[0].trim(),
                bssid: parts[1].trim(),
                channel: parseInt(parts[3]) || 0,
                signal_level: parseInt(parts[6]) || -100,
                encryption: determineEncryptionFromSecurity(parts[8] || ''),
                frequency: ''
            };
            
            // Only add networks with SSID
            if (network.ssid && network.ssid !== '--') {
                networks.push(network);
            }
        }
    }
    
    return networks;
}

/**
 * Parse iw scan results
 * 
 * @param {string} output - Output from iw scan
 * @returns {Array} - Parsed network list
 */
function parseIwResults(output) {
    const networks = [];
    const bssBlocks = output.split('BSS ').slice(1);
    
    for (const block of bssBlocks) {
        const network = {
            ssid: '',
            bssid: '',
            signal_level: 0,
            encryption: 'OPEN',
            channel: 0,
            frequency: ''
        };
        
        // Extract BSSID
        const bssidMatch = block.match(/^([a-f0-9:]{17})/);
        if (bssidMatch) {
            network.bssid = bssidMatch[1];
        }
        
        // Extract SSID
        const ssidMatch = block.match(/SSID: (.+)/);
        if (ssidMatch) {
            network.ssid = ssidMatch[1].trim();
        }
        
        // Extract signal level
        const signalMatch = block.match(/signal: (-?\d+\.\d+) dBm/);
        if (signalMatch) {
            network.signal_level = Math.round(parseFloat(signalMatch[1]));
        }
        
        // Extract frequency and calculate channel
        const freqMatch = block.match(/freq: (\d+)/);
        if (freqMatch) {
            const freq = parseInt(freqMatch[1]);
            network.frequency = `${freq / 1000} GHz`;
            network.channel = frequencyToChannel(freq);
        }
        
        // Determine encryption
        if (block.includes('Privacy: yes')) {
            if (block.includes('RSN:')) {
                network.encryption = 'WPA2';
            } else if (block.includes('WPA:')) {
                network.encryption = 'WPA';
            } else {
                network.encryption = 'WEP';
            }
        }
        
        // Only add networks with SSID
        if (network.ssid) {
            networks.push(network);
        }
    }
    
    return networks;
}

/**
 * Convert frequency to channel number
 * 
 * @param {number} frequency - Frequency in MHz
 * @returns {number} - Channel number
 */
function frequencyToChannel(frequency) {
    if (frequency >= 2412 && frequency <= 2484) {
        // 2.4 GHz band
        if (frequency === 2484) return 14;
        return Math.floor((frequency - 2412) / 5) + 1;
    } else if (frequency >= 5170 && frequency <= 5825) {
        // 5 GHz band
        return Math.floor((frequency - 5000) / 5);
    }
    return 0;
}

/**
 * Determine encryption type from security string
 * 
 * @param {string} security - Security information from nmcli
 * @returns {string} - Encryption type
 */
function determineEncryptionFromSecurity(security) {
    if (!security || security === '--') return 'OPEN';
    
    const secLower = security.toLowerCase();
    if (secLower.includes('wpa3')) return 'WPA3';
    if (secLower.includes('wpa2')) return 'WPA2';
    if (secLower.includes('wpa')) return 'WPA';
    if (secLower.includes('wep')) return 'WEP';
    
    return 'OPEN';
}

/**
 * Check if running with sufficient privileges for network scanning
 * 
 * @returns {Promise<boolean>} - True if privileges are sufficient
 */
async function checkPrivileges() {
    try {
        // Check if running as root
        const { stdout } = await execAsync('id -u');
        return stdout.trim() === '0';
    } catch (error) {
        return false;
    }
}

/**
 * Get detailed information about the current WiFi connection
 * 
 * @returns {Promise<Object>} - Current connection details
 */
async function getCurrentConnection() {
    try {
        // Try nmcli first
        try {
            const { stdout } = await execAsync('nmcli connection show --active');
            const lines = stdout.split('\n');
            for (const line of lines) {
                if (line.includes('wifi')) {
                    const parts = line.split(/\s{2,}/);
                    return {
                        ssid: parts[0],
                        interface: parts[3],
                        type: 'wifi'
                    };
                }
            }
        } catch (e) {
            // nmcli failed, try iwconfig
        }
        
        // Try iwconfig
        const interface = await getWirelessInterface();
        const { stdout } = await execAsync(`iwconfig ${interface}`);
        const ssidMatch = stdout.match(/ESSID:"([^"]*)"/);
        
        return {
            ssid: ssidMatch ? ssidMatch[1] : 'Unknown',
            interface: interface,
            type: 'wifi'
        };
    } catch (error) {
        return {
            ssid: 'Not connected',
            interface: 'Unknown',
            type: 'wifi'
        };
    }
}

// Export functions for use in other parts of the application
module.exports = {
    scanNetworks,
    scanWithIwlist,
    scanWithNmcli,
    scanWithIw,
    getWirelessInterface,
    checkPrivileges,
    getCurrentConnection
};
