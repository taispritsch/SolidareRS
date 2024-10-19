import { Header } from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert, FlatList, StyleSheet, Modal } from "react-native";
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, Button, FAB, Portal, Provider, Snackbar } from 'react-native-paper';
import { styles } from './styles';

interface UrgentDonation {
    id: number; 
    product_description: string;
    category_description: string;
    urgent: boolean;
}

interface Variation {
    id: number;
    product_id: number,
    caracteristic_id: number,
    description: string;
}


const UrgentDonationScreen = () => {
    const [urgentDonations, setUrgentDonations] = useState<UrgentDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<UrgentDonation | null>(null); 
    const [productSizes, setProductSizes] = useState([]);

    const [subcategories, setSubcategories] = useState<{ id: BigInteger; description: string; selected: boolean }[]>([]);


    const router = useRouter()

    useEffect(() => {
        fetchUrgentDonations();
    }, []);

    const fetchProductVariations = async (productId: number): Promise<Variation[]> => {
        try {
            const response = await axiosInstance.get(`/products/${productId}/variations`);
            const variations: Variation[] = response.data.map((variation: Variation) => ({
                id: variation.id,
                description: variation.description,
                caracteristic_id: variation.caracteristic_id,
                product_id: variation.product_id,
            }));
            return variations;
        } catch (error) {
            console.error('Erro ao buscar as variações do produto:', error);
            return [];
        }
    };
    

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
    
    const handleEditDonation = (donation: UrgentDonation) => {
        const selectedProducts = JSON.stringify([{ id: donation.id, description: donation.product_description, urgency: donation.urgent }]);
        router.push({
            pathname: '/DonationItemUrgentForm',
            params: {
                selectedProducts,
                donationPlaceId: donation.id,
                categoryDescription: donation.category_description, 
            },
        });
    };

    const openViewSizesModal = async (donation: any) => {
        setSelectedDonation(donation); 
        const sizes = await fetchProductVariations(donation.id);
        setModalVisible(true);
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
                                        title={donation.product_description}
                                        category={donation.category_description}
                                        hasOptionMenu
                                        menuOptions={['editar', 'visualizar']}
                                        onEditPress={() => handleEditDonation(donation)}
                                        onViewSizesPress={() => openViewSizesModal(donation)} 
                                    />
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', paddingTop: 80 }}>Você ainda não tem nenhum item urgente cadastrado.</Text>
                            )}
                            {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
                        </View>
                    </ScrollView>
                </View>

                {modalVisible && selectedDonation && (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={style.modalBackground}>
                            <View style={style.modalContent}>
                                <Text>{selectedDonation.product_description} - {selectedDonation.category_description}</Text>
                                <Text>Tamanhos</Text>
                                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Tamanhos Disponíveis:</Text>
                                    {productSizes.length > 0 ? (
                                        productSizes.map((size: Variation) => (
                                            <Text key={size.id}>{size.description}</Text>
                                        ))
                                    ) : (
                                        <Text>Nenhum tamanho encontrado.</Text>
                                    )}
                                <Button mode="contained" onPress={() => setModalVisible(false)}>
                                    Fechar
                                </Button>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </Provider>
    );
};

const style = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'semibold',
      marginBottom: 20,
    },
    modalSubtitle: {
      textAlign: 'left'
    },
    closeModal: {
    },
  });

export default UrgentDonationScreen;