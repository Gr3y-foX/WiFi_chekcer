// This file contains unit tests for macOS-specific functionalities, verifying the adapter and system calls.

const { expect } = require('chai');
const { scanNetworks } = require('../src/platforms/macos/adapter');
const { executeCommand } = require('../src/platforms/macos/system-calls');

describe('macOS Platform Tests', () => {
    describe('Adapter Tests', () => {
        it('should scan for available WiFi networks', async () => {
            const networks = await scanNetworks();
            expect(networks).to.be.an('array');
            expect(networks.length).to.be.greaterThan(0);
        });
    });

    describe('System Calls Tests', () => {
        it('should execute system command successfully', async () => {
            const result = await executeCommand('echo "Hello World"');
            expect(result).to.equal('Hello World');
        });
    });
});