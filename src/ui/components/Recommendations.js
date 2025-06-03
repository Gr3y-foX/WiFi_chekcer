import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Recommendations component that provides suggestions based on scan results
const Recommendations = ({ vulnerabilities }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommendations</Text>
            {vulnerabilities.length > 0 ? (
                vulnerabilities.map((vuln, index) => (
                    <Text key={index} style={styles.recommendation}>
                        {vuln}
                    </Text>
                ))
            ) : (
                <Text style={styles.noVulnerabilities}>No vulnerabilities found.</Text>
            )}
        </View>
    );
};

// Styles for the Recommendations component
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    recommendation: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    noVulnerabilities: {
        fontSize: 16,
        color: '#888',
    },
});

export default Recommendations;