import { Header } from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert, FlatList, StyleSheet } from "react-native";
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, FAB, Portal, Provider, Snackbar } from 'react-native-paper';
import { CategoriesIcons } from '@/constants/CategoriesIcons';

interface UrgentDonation {
    id: number; 
    product: {
        name: string; 
    };
    urgent: boolean;
}

const UrgentDonationScreen = () => {
    const [urgentDonations, setUrgentDonations] = useState<UrgentDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetchUrgentDonations();
    }, []);

    const fetchUrgentDonations = async () => {
        try {
            const response = await axiosInstance.get('/donations/urgent');
            setUrgentDonations(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load urgent donations.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Doações Urgentes</Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={urgentDonations}
                        keyExtractor={(item) => item.id.toString()} 
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.productText}>Produto: {item.product.name}</Text>
                                <Text style={styles.urgentText}>Urgente: {item.urgent ? 'Sim' : 'Não'}</Text>
                            </View>
                        )}
                    />
                )}
                {error && (
                    <Snackbar
                        visible={true}
                        onDismiss={() => setError(null)}
                        duration={3000}
                    >
                        {error}
                    </Snackbar>
                )}
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    content: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    productText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    urgentText: {
        fontSize: 16,
        color: 'red',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});


export default UrgentDonationScreen;