import { Header } from '@/components/Header';
import React, { useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { FAB, Portal, Provider, Snackbar } from 'react-native-paper';
import { CategoriesIcons } from '@/constants/CategoriesIcons';

const DonationScreen = () => {
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { placeName, showSnackbar, action, donationPlaceId } = useLocalSearchParams();
    const [visible, setVisible] = React.useState(false);

    const [donationListCategories, setDonationListCategories] = useState<{ id: number; description: keyof typeof CategoriesIcons }[]>([]);

    const onDismissSnackBar = () => setVisible(false);

    React.useEffect(() => {
        getCategories();

        if (showSnackbar) {
                setSnackbarMessage('Lista de doações atualizada com sucesso!');
            setVisible(true);
        }

    }, [showSnackbar]);

    const getCategories = async () => {
        try {
            const response = await axiosInstance.get(`donations/${donationPlaceId}/categories`);

            setDonationListCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const nextStep = (category: { description: keyof typeof CategoriesIcons }) => {
        if (category.description !== 'Roupas e calçados') {
            router.push({ pathname: '/DonationProductScreen', params: { ...category, donationPlaceId: donationPlaceId, title: placeName, placeName: placeName } });
        } else {
            console.log('Roupas e calçados');
        }
    }

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Text style={styles.title}>Categoria dos itens</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {donationListCategories.map((donationListCategory, index) => (
                                <DynamicCard
                                    title={donationListCategory.description}
                                    icon={CategoriesIcons[donationListCategory.description]}
                                    onPress={() => nextStep(donationListCategory)}
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
                            router.push({ pathname: '/DonationCategoryForm', params: { title: placeName, donationPlaceId: donationPlaceId } });
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