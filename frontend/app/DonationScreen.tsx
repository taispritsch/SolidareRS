import { Header } from '@/components/Header';
import React, { useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { FAB, IconButton, Menu, Portal, Provider, Snackbar } from 'react-native-paper';
import { CategoriesIcons } from '@/constants/CategoriesIcons';
import CategoriesFilters from '@/components/CategoriesFilters';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const DonationScreen = () => {
    const openMenu = () => setVisible(true);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { placeName, showSnackbar, action, donationPlaceId } = useLocalSearchParams();
    const [visible, setVisible] = React.useState(false);

    const [donationProducts, setdonationProducts] = useState<{ id: number; description: string; donation_id: number; category_description: string; subcategory_description: string, urgent: boolean }[]>([]);

    const onDismissSnackBar = () => setVisible(false);

    const [categories, setCategories] = useState<{ id: number, description: keyof typeof CategoriesIcons, selected: boolean }[]>([]);

    React.useEffect(() => {
        getProducts();
        getCategories();

        if (showSnackbar) {
            setSnackbarMessage('Lista de doações atualizada com sucesso!');
            setVisible(true);
        }
    }, [showSnackbar]);

    useFocusEffect(
        React.useCallback(() => {
            getProducts();
            getCategories();
        }, [])
    );


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

    const getProducts = async (index?: number) => {
        let categoryFilter = null;
        if (index !== undefined) {
            categoryFilter = categories[index] && !categories[index].selected ? categories[index] : null;
        }

        try {
            const response = await axiosInstance.get(`donations/${donationPlaceId}/products`, {
                params: {
                    category_id: categoryFilter ? categoryFilter.id : null
                }
            });

            const products = response.data.map((product: { id: number; description: string; donation_id: number; category_description: string; subcategory_description: string, urgent: boolean }) => {
                return {
                    id: product.id,
                    description: product.description,
                    donation_id: product.donation_id,
                    urgent: product.urgent,
                    category_description: product.category_description,
                    subcategory_description: product.subcategory_description
                }
            });

            setdonationProducts(products);
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
        getProducts(index);
    }

    const handleEditDonation = (product: any) => {
        const selectedProducts = JSON.stringify([
            {
                id: product.id,
                description: product.description,
                parentCategory: product.category_description,
            }
        ]);

        router.push({
            pathname: '/DonationItemUrgentForm',
            params: {
                selectedProducts,
                categoryDescription: product.category_description,
                productId: product.id,
                productDescription: product.description,
                isEditing: 'true',
                title: placeName,
                donationPlaceId: donationPlaceId,
                placeName: placeName
            },
        });
    };

    const handleEditUrgentDonation = (product: any) => {
        const selectedProducts = JSON.stringify([
            {
                id: product.id,
                description: product.description,
                parentCategory: product.category_description,
                donationId: product.donation_id,
                urgency: product.urgent
            }
        ]);

        router.push({
            pathname: '/DonationItemUrgentForm',
            params: {
                selectedProducts,
                categoryDescription: product.category_description,
                productId: product.id,
                productDescription: product.description,
                isEditing: 'true',
                isUrgent: 'true',
                title: placeName,
                donationPlaceId: donationPlaceId,
                placeName: placeName
            },
        });
    };

    async function showDeleteAlert(id: number) {
        const isUrgentProduct = donationProducts.find(product => product.donation_id === id)?.urgent;

        Alert.alert(
            "Excluir produto",
            isUrgentProduct ? "Este item é urgente. Deseja excluir mesmo assim?" : "Deseja excluir este item?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Excluir", onPress: () => { deleteProduct(id) } }
            ]
        );
    }

    async function deleteProduct(id: number) {
        try {
            await axiosInstance.delete(`donations/${id}`);

            getProducts();
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível excluir o produto.');
        }
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Itens aceitos</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Veja quais os itens que precisam de doação! </Text>
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
                        <View style={{ padding: 20, position: 'relative' }}>
                            {donationProducts.length === 0 && <Text style={{ textAlign: 'center' }}>Nenhum item cadastrado</Text>}
                            {donationProducts
                                .filter(product => product.category_description === 'Roupas e calçados')
                                .map((product, index) => (
                                    <DynamicCard
                                        key={index}
                                        title={product.description}
                                        category={product.subcategory_description}
                                        hasOptionMenu
                                        menuOptions={['editar', 'editar urgência', 'excluir']}
                                        onEditPress={() => handleEditDonation(product)}
                                        onEditUrgencyPress={() => handleEditUrgentDonation(product)}
                                    />
                                ))}

                            {donationProducts
                                .filter(product => product.category_description !== 'Roupas e calçados')
                                .map((product, index) => (
                                    <DynamicCard
                                        key={index}
                                        title={product.description}
                                        hasOptionMenu
                                        menuOptions={['editar urgência', 'excluir']}
                                        onDeletPress={() => showDeleteAlert(product.donation_id)}
                                        onEditUrgencyPress={() => handleEditUrgentDonation(product)}
                                    />
                                ))}
                        </View>
                    </ScrollView>

                    <Snackbar
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        duration={1500}
                        action={{
                            label: 'Fechar',
                            onPress: () => {
                                onDismissSnackBar();
                            },
                        }}
                    >
                        {snackbarMessage}
                    </Snackbar>

                    <FAB
                        icon='plus'
                        onPress={() => {
                            router.push({ pathname: '/DonationCategoryForm', params: { title: placeName, donationPlaceId: donationPlaceId, placeName: placeName } });
                        }}
                        color='#FFFFFF'
                        style={{ backgroundColor: '#133567', ...styles.addButton }}
                    />
                </View>
            </View>
        </Provider>
    );
}

export default DonationScreen;