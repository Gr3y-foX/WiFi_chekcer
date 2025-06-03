import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Scanner } from '../../core/scanner'; // Importing the Scanner class from core
import { Analyzer } from '../../core/analyzer'; // Importing the Analyzer class from core

const ScannerComponent = () => {
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState(null);

    const handleScan = async () => {
        setScanning(true);
        const scanner = new Scanner(); // Create an instance of the Scanner class
        const scanResults = await scanner.initiateScan(); // Initiate the scan
        const analyzer = new Analyzer(); // Create an instance of the Analyzer class
        const vulnerabilities = analyzer.evaluate(scanResults); // Analyze the results for vulnerabilities
        setResults(vulnerabilities); // Set the results state
        setScanning(false);
    };

    return (
        <View style={styles.container}>
            <Button title="Start Scan" onPress={handleScan} disabled={scanning} />
            {scanning && <Text>Scanning...</Text>}
            {results && (
                <View>
                    <Text>Scan Results:</Text>
                    {/* Render results here */}
                    <Text>{JSON.stringify(results, null, 2)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ScannerComponent;