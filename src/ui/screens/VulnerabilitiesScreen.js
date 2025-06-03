import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// VulnerabilitiesScreen component displays a list of identified vulnerabilities
const VulnerabilitiesScreen = ({ vulnerabilities }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Identified Vulnerabilities</Text>
            <FlatList
                data={vulnerabilities}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
};

// Styles for the VulnerabilitiesScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    itemDescription: {
        fontSize: 14,
        color: '#555',
    },
});

// Exporting the VulnerabilitiesScreen component for use in other parts of the application
export default VulnerabilitiesScreen;