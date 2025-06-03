// This file contains unit tests for the scanner functionality, ensuring the scanning logic works as intended.

import { Scanner } from '../../src/core/scanner';

describe('Scanner', () => {
    let scanner;

    beforeEach(() => {
        scanner = new Scanner();
    });

    test('should initiate a scan', async () => {
        const result = await scanner.initiateScan();
        expect(result).toBeDefined();
        expect(result.networks).toBeInstanceOf(Array);
    });

    test('should handle scan results', () => {
        const mockResults = {
            networks: [
                { ssid: 'TestNetwork1', security: 'WPA2' },
                { ssid: 'TestNetwork2', security: 'WEP' },
            ],
        };
        scanner.handleResults(mockResults);
        expect(scanner.results).toEqual(mockResults);
    });

    test('should identify vulnerabilities', () => {
        const mockResults = {
            networks: [
                { ssid: 'VulnerableNetwork', security: 'WEP' },
            ],
        };
        scanner.handleResults(mockResults);
        const vulnerabilities = scanner.analyzeResults();
        expect(vulnerabilities).toContain('VulnerableNetwork has WEP security, which is insecure.');
    });
});