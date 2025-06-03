// filepath: /wifi-vulnerability-scanner/wifi-vulnerability-scanner/src/platforms/mobile/ios/network-extension.js

// This file provides network extension functionalities for iOS devices.
// It exports functions to manage WiFi connections and access network information.

import { NativeModules } from 'react-native';

// Importing the native module for network operations
const { NetworkExtension } = NativeModules;

// Function to connect to a WiFi network
export const connectToWiFi = async (ssid, password) => {
    try {
        await NetworkExtension.connectToWiFi(ssid, password);
        console.log(`Connected to WiFi: ${ssid}`);
    } catch (error) {
        console.error(`Failed to connect to WiFi: ${error.message}`);
    }
};

// Function to disconnect from the current WiFi network
export const disconnectFromWiFi = async () => {
    try {
        await NetworkExtension.disconnectFromWiFi();
        console.log('Disconnected from WiFi');
    } catch (error) {
        console.error(`Failed to disconnect from WiFi: ${error.message}`);
    }
};

// Function to get the current WiFi network information
export const getCurrentWiFiInfo = async () => {
    try {
        const info = await NetworkExtension.getCurrentWiFiInfo();
        return info;
    } catch (error) {
        console.error(`Failed to get WiFi info: ${error.message}`);
        return null;
    }
};