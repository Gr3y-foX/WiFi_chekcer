/**
 * Linux System Calls Module
 * 
 * This file contains system call implementations for Linux to perform network operations.
 * It exports functions for executing system commands related to WiFi scanning and management.
 */

const { exec, spawn } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;

/**
 * Executes a system command and returns the output
 * 
 * @param {string} command - The command to execute
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} - A promise that resolves with the command output
 */
async function executeCommand(command, options = {}) {
    try {
        const { stdout, stderr } = await execAsync(command, {
            timeout: options.timeout || 30000,
            maxBuffer: options.maxBuffer || 1024 * 1024,
            ...options
        });
        
        return {
            success: true,
            stdout: stdout.trim(),
            stderr: stderr.trim()
        };
    } catch (error) {
        return {
            success: false,
            stdout: '',
            stderr: error.message,
            code: error.code
        };
    }
}

/**
 * Check if a command/tool is available on the system
 * 
 * @param {string} command - Command to check
 * @returns {Promise<boolean>} - True if command is available
 */
async function isCommandAvailable(command) {
    try {
        await execAsync(`which ${command}`);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Install WiFi scanning tools on Linux
 * 
 * @returns {Promise<Object>} - Installation result
 */
async function installWifiTools() {
    const tools = {
        'wireless-tools': false,
        'iw': false,
        'network-manager': false
    };
    
    // Check what's already installed
    tools['wireless-tools'] = await isCommandAvailable('iwlist');
    tools['iw'] = await isCommandAvailable('iw');
    tools['network-manager'] = await isCommandAvailable('nmcli');
    
    // If nothing is installed, try to install
    if (!tools['wireless-tools'] && !tools['iw'] && !tools['network-manager']) {
        console.log('No WiFi tools found. Attempting to install...');
        
        // Detect package manager and install tools
        if (await isCommandAvailable('apt')) {
            // Debian/Ubuntu
            const result = await executeCommand('sudo apt update && sudo apt install -y wireless-tools iw network-manager');
            return { packageManager: 'apt', result: result.success };
        } else if (await isCommandAvailable('dnf')) {
            // Fedora/RHEL
            const result = await executeCommand('sudo dnf install -y wireless-tools iw NetworkManager');
            return { packageManager: 'dnf', result: result.success };
        } else if (await isCommandAvailable('pacman')) {
            // Arch Linux
            const result = await executeCommand('sudo pacman -S --noconfirm wireless_tools iw networkmanager');
            return { packageManager: 'pacman', result: result.success };
        } else if (await isCommandAvailable('zypper')) {
            // openSUSE
            const result = await executeCommand('sudo zypper install -y wireless-tools iw NetworkManager');
            return { packageManager: 'zypper', result: result.success };
        }
    }
    
    return { tools, installed: Object.values(tools).some(Boolean) };
}

/**
 * Get system information relevant to WiFi scanning
 * 
 * @returns {Promise<Object>} - System information
 */
async function getSystemInfo() {
    const info = {
        os: 'Linux',
        kernel: '',
        distribution: '',
        architecture: '',
        user: '',
        privileges: false
    };
    
    try {
        // Get kernel version
        const kernelResult = await executeCommand('uname -r');
        if (kernelResult.success) {
            info.kernel = kernelResult.stdout;
        }
        
        // Get distribution info
        try {
            const releaseData = await fs.readFile('/etc/os-release', 'utf8');
            const distMatch = releaseData.match(/PRETTY_NAME="([^"]+)"/);
            if (distMatch) {
                info.distribution = distMatch[1];
            }
        } catch (e) {
            // Try alternative method
            const lsbResult = await executeCommand('lsb_release -d');
            if (lsbResult.success) {
                const match = lsbResult.stdout.match(/Description:\s*(.+)/);
                if (match) {
                    info.distribution = match[1];
                }
            }
        }
        
        // Get architecture
        const archResult = await executeCommand('uname -m');
        if (archResult.success) {
            info.architecture = archResult.stdout;
        }
        
        // Get current user
        const userResult = await executeCommand('whoami');
        if (userResult.success) {
            info.user = userResult.stdout;
        }
        
        // Check privileges
        const idResult = await executeCommand('id -u');
        if (idResult.success) {
            info.privileges = idResult.stdout === '0';
        }
        
    } catch (error) {
        console.warn('Could not gather complete system information:', error.message);
    }
    
    return info;
}

/**
 * Monitor WiFi interface for changes (useful for real-time scanning)
 * 
 * @param {string} interface - WiFi interface to monitor
 * @param {Function} callback - Callback function for events
 * @returns {Object} - Monitor object with stop method
 */
function monitorWifiInterface(interface, callback) {
    let monitor = null;
    
    try {
        // Use iw event to monitor WiFi events
        monitor = spawn('iw', ['event'], {
            stdio: ['ignore', 'pipe', 'pipe']
        });
        
        monitor.stdout.on('data', (data) => {
            const output = data.toString();
            if (output.includes(interface)) {
                callback({
                    type: 'interface_event',
                    interface: interface,
                    data: output.trim()
                });
            }
        });
        
        monitor.stderr.on('data', (data) => {
            console.warn('WiFi monitor stderr:', data.toString());
        });
        
        monitor.on('close', (code) => {
            console.log(`WiFi monitor exited with code ${code}`);
        });
        
    } catch (error) {
        console.error('Failed to start WiFi monitor:', error.message);
    }
    
    return {
        stop: () => {
            if (monitor) {
                monitor.kill();
                monitor = null;
            }
        },
        isRunning: () => monitor !== null
    };
}

/**
 * Perform a network connectivity test
 * 
 * @param {string} target - Target to ping (default: 8.8.8.8)
 * @param {number} count - Number of pings (default: 4)
 * @returns {Promise<Object>} - Connectivity test results
 */
async function testConnectivity(target = '8.8.8.8', count = 4) {
    try {
        const result = await executeCommand(`ping -c ${count} ${target}`);
        
        if (result.success) {
            // Parse ping results
            const output = result.stdout;
            const lossMatch = output.match(/(\d+)% packet loss/);
            const avgMatch = output.match(/min\/avg\/max\/mdev = [\d.]+\/([\d.]+)/);
            
            return {
                success: true,
                target: target,
                packetLoss: lossMatch ? parseInt(lossMatch[1]) : 0,
                averageTime: avgMatch ? parseFloat(avgMatch[1]) : 0,
                rawOutput: output
            };
        } else {
            return {
                success: false,
                target: target,
                error: result.stderr,
                packetLoss: 100
            };
        }
    } catch (error) {
        return {
            success: false,
            target: target,
            error: error.message,
            packetLoss: 100
        };
    }
}

/**
 * Get WiFi interface statistics
 * 
 * @param {string} interface - WiFi interface name
 * @returns {Promise<Object>} - Interface statistics
 */
async function getInterfaceStats(interface) {
    try {
        const stats = {
            interface: interface,
            txBytes: 0,
            rxBytes: 0,
            txPackets: 0,
            rxPackets: 0,
            errors: 0,
            dropped: 0
        };
        
        // Read from /proc/net/dev
        const netDevData = await fs.readFile('/proc/net/dev', 'utf8');
        const lines = netDevData.split('\n');
        
        for (const line of lines) {
            if (line.includes(interface + ':')) {
                const parts = line.split(/\s+/);
                const interfaceIndex = parts.findIndex(part => part.includes(interface));
                
                if (interfaceIndex >= 0) {
                    stats.rxBytes = parseInt(parts[interfaceIndex + 1]) || 0;
                    stats.rxPackets = parseInt(parts[interfaceIndex + 2]) || 0;
                    stats.rxErrors = parseInt(parts[interfaceIndex + 3]) || 0;
                    stats.rxDropped = parseInt(parts[interfaceIndex + 4]) || 0;
                    stats.txBytes = parseInt(parts[interfaceIndex + 9]) || 0;
                    stats.txPackets = parseInt(parts[interfaceIndex + 10]) || 0;
                    stats.txErrors = parseInt(parts[interfaceIndex + 11]) || 0;
                    stats.txDropped = parseInt(parts[interfaceIndex + 12]) || 0;
                }
                break;
            }
        }
        
        return stats;
    } catch (error) {
        return {
            interface: interface,
            error: error.message
        };
    }
}

/**
 * Set WiFi interface power management
 * 
 * @param {string} interface - WiFi interface name
 * @param {boolean} enabled - Enable or disable power management
 * @returns {Promise<Object>} - Operation result
 */
async function setInterfacePowerManagement(interface, enabled) {
    try {
        const command = enabled ? 
            `iwconfig ${interface} power on` : 
            `iwconfig ${interface} power off`;
            
        const result = await executeCommand(command);
        return {
            success: result.success,
            interface: interface,
            powerManagement: enabled,
            message: result.stderr || 'Power management updated'
        };
    } catch (error) {
        return {
            success: false,
            interface: interface,
            error: error.message
        };
    }
}

module.exports = {
    executeCommand,
    isCommandAvailable,
    installWifiTools,
    getSystemInfo,
    monitorWifiInterface,
    testConnectivity,
    getInterfaceStats,
    setInterfacePowerManagement
};
