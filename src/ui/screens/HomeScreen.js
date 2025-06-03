import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// HomeScreen component serves as the main entry point for users
const HomeScreen = () => {
    const navigation = useNavigation();

    // Function to navigate to the ScanScreen
    const handleScanPress = () => {
        navigation.navigate('ScanScreen');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>WiFi Vulnerability Scanner</Text>
            <Button title="Start Scan" onPress={handleScanPress} />
        </View>
    );
};

export default HomeScreen;