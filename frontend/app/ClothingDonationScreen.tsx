import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { styles } from './styles';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Provider } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import SimpleCard from '@/components/SimpleCard';
import axiosInstance from '@/services/axios';

interface Subcategory {
    id: number;
    description: string;
}

const ClothingDonationScreen = () => {
    const { placeName, donationPlaceId } = useLocalSearchParams();
    const { categoryId } = useLocalSearchParams();
    const [category] = useState(useLocalSearchParams());
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axiosInstance.get(`categories/${category.id}/subcategories`);
                const data: Subcategory[] = response.data;
                setSubcategories(data);
            } catch (error) {
                console.error("Erro ao buscar subcategorias:", error);
            }
        };

        fetchSubcategories();
    }, [categoryId]);


    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Novo Item</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Selecione os produtos de <Text style={{ fontWeight: 'bold' }}>{category.description}</Text></Text>
                    </View>

                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {subcategories.map((subcategory, index) => (
                                <SimpleCard
                                    key={index}
                                    title={subcategory.description}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/DonationClothesForm',
                                            params: {
                                                ...category,
                                                donationPlaceId: donationPlaceId,
                                                title: placeName,
                                                placeName: placeName
                                            }
                                        });
                                    }}
                                />
                            ))}
                        </View>

                        {subcategories.length === 0 && (
                            <View style={{ padding: 20 }}>
                                <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma subcategoria encontrada.</Text>
                            </View>
                        )}
                    </ScrollView>
                    {/* <View style={{ padding: 20, alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            style={style.nextStepContainer}
                        >
                            <Text style={style.nextStepText}>Próximo passo</Text>
                            <Text style={style.iconText}>››</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        </Provider>
    );
}

export default ClothingDonationScreen;

const style = StyleSheet.create({
    nextStepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
    },
    nextStepText: {
        color: Colors.backgroundButton,
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconText: {
        color: Colors.backgroundButton,
        fontSize: 22,
        marginLeft: 8,
    },
});