import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert, StyleSheet } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import { Provider } from 'react-native-paper';
import { CategoriesIcons } from '@/constants/CategoriesIcons';

const DonationCategoryForm = () => {
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { placeName, donationPlaceId } = useLocalSearchParams();

    const [categories, setCategories] = useState<{ description: keyof typeof CategoriesIcons }[]>([]);

    const getCategories = async () => {
        try {
            const response = await axiosInstance.get('categories');

            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect((): void => {
        getCategories();
    }, []);

    
    const nextStep = (category: { description: keyof typeof CategoriesIcons }) => {
        if (category.description !== 'Roupas e calçados') {
            router.push({ pathname: '/DonationItemForm', params: { ...category, donationPlaceId: donationPlaceId, title: placeName, placeName: placeName } });
        } else {
            console.log('Roupas e calçados');
        }
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Novo item</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Selecione uma categoria</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {categories.map((category, index) => (
                                <DynamicCard
                                    key={index}
                                    title={category.description}
                                    icon={CategoriesIcons[category.description]}
                                    onPress={() => nextStep(category)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Provider>
    );
}

export default DonationCategoryForm;

