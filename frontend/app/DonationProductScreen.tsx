import { Header } from '@/components/Header';
import React, { useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { FAB, Portal, Provider, Snackbar } from 'react-native-paper';

const DonationProductScreen = () => {
    const { placeName, showSnackbar, donationPlaceId, categoryId } = useLocalSearchParams();

    const [donationProducts, setDonationProducts] = useState<{ donation_id: number; description: string }[]>([]);

    const [category] = useState(useLocalSearchParams());

    React.useEffect(() => {
        getProductsByCategory();
    }, []);

    async function showDeleteAlert(id: number) {
        Alert.alert(
            "Excluir produto",
            "Deseja realmente excluir esse produto?",
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


            getProductsByCategory();
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível excluir o produto.');
        }
    }

    const getProductsByCategory = async () => {
        try {
            const response = await axiosInstance.get(`donations/${donationPlaceId}/category/${category.id}/products`);

            console.log(response.data);

            setDonationProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Text style={styles.title}>{category.description}</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {donationProducts.map((donationListCategory: { donation_id: number; description: string }, index) => (
                                <DynamicCard
                                    key={index}
                                    title={donationListCategory.description}
                                    hasOptionMenu
                                    menuOptions={['excluir']}
                                    onDeletPress={() => showDeleteAlert(donationListCategory.donation_id)}
                                    onPress={() => showDeleteAlert(donationListCategory.donation_id)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Provider>
    );
}

export default DonationProductScreen;