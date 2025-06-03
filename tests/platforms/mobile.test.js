// This file contains unit tests for mobile functionalities, ensuring the Android and iOS implementations work correctly.

import { scanWifiNetworks, connectToNetwork, disconnectFromNetwork } from '../../src/platforms/mobile/android/wifi-manager';
import { manageNetworkExtension } from '../../src/platforms/mobile/ios/network-extension';

describe('Mobile WiFi Manager', () => {
    test('should scan for WiFi networks on Android', async () => {
        const networks = await scanWifiNetworks();
        expect(Array.isArray(networks)).toBe(true);
    });

    test('should connect to a WiFi network on Android', async () => {
        const result = await connectToNetwork('SSID', 'password');
        expect(result).toBe(true);
    });

    test('should disconnect from a WiFi network on Android', async () => {
        const result = await disconnectFromNetwork();
        expect(result).toBe(true);
    });
});

describe('iOS Network Extension', () => {
    test('should manage network connections on iOS', async () => {
        const result = await manageNetworkExtension('SSID', 'password');
        expect(result).toBe(true);
    });
});