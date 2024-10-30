import { Header } from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert, FlatList, StyleSheet, Modal } from "react-native";
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, Button, FAB, Portal, Provider, Snackbar } from 'react-native-paper';
import { styles } from './styles';
import CategoriesFilters from '@/components/CategoriesFilters';
import { CategoriesIcons } from '@/constants/CategoriesIcons';
import PlaceForm from './BusinessHourScreen';

interface UrgentDonation {
    id: number;
    product_id: number; 
    donation_place_id: number;  
    product_description: string;
    parent_category_description: string;
    urgent: boolean;
    subcategory_description: string;
    variations?: Variation[]; 
}

interface Variation {
    id: number;
    name: string,
    product_id: number,
    caracteristic_id: number,
    description: string;
}


const UrgentDonationScreen = () => {
    const { placeName } = useLocalSearchParams();
    const [urgentDonations, setUrgentDonations] = useState<UrgentDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<UrgentDonation | null>(null); 
    const [productSizes, setProductSizes] = useState([]);

    const [subcategories, setSubcategories] = useState<{ id: BigInteger; description: string; selected: boolean }[]>([]);

    const [categories, setCategories] = useState<{ id: number, description: keyof typeof CategoriesIcons, selected: boolean }[]>([]);

    const router = useRouter()

    useEffect(() => {
        getCategories();
        fetchUrgentDonations();
    }, []);

    const fetchUrgentDonations = async (index?: number) => {
        let categoryFilter = null;
        if (index !== undefined) {
            categoryFilter = categories[index] && !categories[index].selected ? categories[index] : null;
        }

        try {
            const response = await axiosInstance.get('/donations/urgent', {
                params: {
                    category_id: categoryFilter ? categoryFilter.id : null
                }
            });

            setUrgentDonations(response.data);
        } catch (err) {
            console.error(err);
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
        const selectedProducts = JSON.stringify([
            { 
                id: donation.product_id, 
                description: donation.product_description, 
                urgency: donation.urgent 
            }
        ]);
    
        router.push({
            pathname: '/DonationItemUrgentForm',
            params: {
                selectedProducts,
                donationPlaceId: donation.donation_place_id, 
                categoryDescription: donation.parent_category_description, 
                productId: donation.product_id, 
                productDescription: donation.product_description, 
                isEditing: 'true',
                isUrgent: 'true',
                title: placeName,
                placeName: placeName
            },
        });
    };

    const openViewSizesModal = async (donation: UrgentDonation) => {
        setSelectedDonation(donation);
        setModalVisible(true);

        try {
            const response = await axiosInstance.get('products/registered-urgent-variations', {
                params: { product_ids: [donation.product_id] },
            });

            console.log('response', response.data);
            
            const variationsData = response.data;

            console.log('variationsData', variationsData);
            if (variationsData.length > 0) {
                setProductSizes(variationsData);
            } else {
                setProductSizes([]);
            }
        } catch (error) {
            console.error('Erro ao buscar variações:', error);
            setProductSizes([]); 
        } finally {
            setLoading(false); 
        }
    };

    const getCategories = async () => {
        try {
            const response = await axiosInstance.get('categories');

            const categories = response.data.map((category: { id: number; description: keyof typeof CategoriesIcons }) => {
                return {
                    id: category.id,
                    description: category.description,
                    selected: false
                }
            });

            setCategories(categories);

        } catch (error) {
            console.log(error);
        }
    }
    
    const selectCategory = (index: number) => {
        const newCategories = categories.map((category, i) => {
            return {
                ...category,
                selected: i === index ? !category.selected : false
            }
        });

        setCategories(newCategories);
        fetchUrgentDonations(index);
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Itens urgentes</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Veja quais os itens que precisam de doação urgente!</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ScrollView horizontal={true}
                            style={{ backgroundColor: '#fff', height: 120 }}>
                            {categories.map((category, index) => (
                                <CategoriesFilters
                                    key={index}
                                    category={category}
                                    onPress={() =>
                                        selectCategory(index)
                                    }
                                />
                            ))}

                        </ScrollView>
                    </View >
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {loading ? (
                                <Text>Carregando...</Text>
                            ) : urgentDonations.length > 0 ? (
                                <>
                                    {urgentDonations
                                        .filter(donation => donation.parent_category_description === 'Roupas e calçados')
                                        .map(donation => (
                                            <DynamicCard
                                                key={donation.id}
                                                title={donation.product_description}
                                                category={donation.subcategory_description}
                                                notShowButton
                                                showButtonTopRight
                                                showButtonTopRightText="Ver tamanhos"
                                                onPress={() => openViewSizesModal(donation)}
                                            />
                                        ))}


                                    {urgentDonations
                                        .filter(donation => donation.parent_category_description !== 'Roupas e calçados')
                                        .map(donation => (
                                            <DynamicCard
                                                key={donation.id}
                                                title={donation.product_description}
                                                notShowButton
                                            />
                                        ))}
                                </>
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
                                <Text style={style.modalTitle}>{selectedDonation.product_description} - {selectedDonation.subcategory_description}</Text>
                                <Text style={{ marginTop: 10 }}>Tamanhos</Text>
                                
                                {loading ? (
                                    <ActivityIndicator size="large" color="#0000ff" />
                                ) : (
                                    productSizes && productSizes.length > 0 ? (
                                        <View style={style.sizesContainer}>
                                            {productSizes.map((size: Variation) => (
                                                <View key={size.id} style={style.cardContent}>
                                                    <Text>{size.description}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <Text>Nenhum tamanho encontrado.</Text>
                                    )
                                )}
                                
                                <View style={style.closeButtonContainer}>
                                    <Button mode="outlined" onPress={() => setModalVisible(false)} style={style.closeButton}>
                                        <Text style={style.closeButtonText}>Fechar</Text>
                                    </Button>
                                </View>
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
      alignItems: 'flex-start',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'semibold',
      marginBottom: 20,
      textTransform: 'capitalize',
    },
    modalSubtitle: {
      textAlign: 'left'
    },
    sizesContainer:{
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'center', 
        gap: 10,
        width: '100%', 
    },
    cardContent: {
        borderWidth: 2,
        borderColor: '#0041A3',
        borderRadius: 7,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
        height: 45,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        padding: 10,
    },
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        width: '100%', 
        marginTop: 20,
    },
    closeButton: {
        backgroundColor: 'transparent',
        borderColor: '#0041A3',
        borderWidth: 2,
        width: '50%',
    },
    closeButtonText: {
        color: 'black',
    },
  });

export default UrgentDonationScreen;