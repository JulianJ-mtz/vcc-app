import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import AmbientDisplay from '@/components/AmbientDisplay';

export default function AmbientScreen() {
    return (
        <ThemedView style={styles.container}>
            <AmbientDisplay 
                collectionName="Ambient"
                realtime={true}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
}); 