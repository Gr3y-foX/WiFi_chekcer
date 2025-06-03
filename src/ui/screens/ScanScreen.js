import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { Scanner } from '../components/Scanner';
import { Results } from '../components/Results';
import { Analyzer } from '../../core/analyzer';

const ScanScreen = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResults, setScanResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleScan = async () => {
        setScanning(true);
        setLoading(true);
        // Simulate scanning process
        const results = await Scanner.scanNetworks();
        setScanResults(results);
        setLoading(false);
        setScanning(false);
    };

    useEffect(() => {
        if (scanResults.length > 0) {
            const analyzer = new Analyzer();
            analyzer.evaluate(scanResults);
        }
    }, [scanResults]);

    return (
        <View>
            <Text>WiFi Vulnerability Scanner</Text>
            <Button title="Start Scan" onPress={handleScan} disabled={scanning} />
            {loading && <ActivityIndicator size="large" />}
            <Results results={scanResults} />
        </View>
    );
};

export default ScanScreen;