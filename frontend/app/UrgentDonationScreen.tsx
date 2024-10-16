import { Header } from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert, FlatList, StyleSheet } from "react-native";
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, FAB, Portal, Provider, Snackbar } from 'react-native-paper';
import { styles } from './styles';

interface UrgentDonation {
    id: number; 
    product: {
        description: string; 
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

    const showRemoveUrgencyAlert = (donationId: number) => {
        Alert.alert(
            "Remover urgência",
            "Você tem certeza que deseja remover a urgência desse item?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", onPress: () => removeUrgency(donationId) }
            ],
            { cancelable: true }
        );
    };
    
    const removeUrgency = async (donationId: number) => {
        try {
            await axiosInstance.put(`/donations/${donationId}/remove-urgency`);
    
            setUrgentDonations(prevDonations =>
                prevDonations.filter(donation => donation.id !== donationId)
            );
        } catch (err) {
            console.error(err);
            setError('Failed to update urgency.');
        }
    };
    
    
    
    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Itens urgentes</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Veja quais os itens que precisam de doação urgente!</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {loading ? (
                                <Text>Carregando...</Text>
                            ) : urgentDonations.length > 0 ? (
                                urgentDonations.map((donation: UrgentDonation) => (
                                    <DynamicCard
                                        key={donation.id}
                                        title={donation.product.description}
                                        hasOptionMenu
                                        menuOptions={['excluir']}
                                        deleteTitle="Remover urgência" 
                                        onDeletPress={() => showRemoveUrgencyAlert(donation.id)}
                                        onPress={() => console.log('Doação selecionada:', donation.id)}
                                    />
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', paddingTop: 80 }}>Você ainda não tem nenhum item urgente cadastrado.</Text>
                            )}
                            {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Provider>
    );
};

export default UrgentDonationScreen;