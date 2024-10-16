import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';
import { CategoriesIcons } from '@/constants/CategoriesIcons';
import { Button, Checkbox, Provider, Switch } from 'react-native-paper';
import SimpleCard from '@/components/SimpleCard';
import { Colors } from '@/constants/Colors';

interface Product {
    id: string;
    description: string;
}

const DonationItemUrgentForm = () => {
    const { selectedProducts, categoryDescription, donationPlaceId } = useLocalSearchParams();
    const [checked, setChecked] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [urgencyStates, setUrgencyStates] = useState<{ [key: string]: boolean }>({}); 
    const [switchSelectedAll, setSwitchSelectedAll] = useState(false);

    let selectedProductsArray: Product[] = []; 
    if (typeof selectedProducts === 'string') {
        try {
            selectedProductsArray = JSON.parse(selectedProducts);
        } catch (error) {
            console.error("Erro ao analisar selectedProducts:", error);
        }
    }

    const handleSave = async () => {
        setLoading(true);
    
        const data = {
            donation_place_id: donationPlaceId,
            products: selectedProductsArray.map((product) => ({
                id: product.id, 
                urgent: urgencyStates[product.id] ? true : false, 
            })),
        };
        
        try {
            console.log(data);
            const response = await axiosInstance.post('donations', data);
            console.log(response.data);
            setLoading(false);
            router.navigate({ pathname: '/DonationScreen', params: { title: categoryDescription, donationPlaceId, showSnackbar: 'true' } });
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleUrgencyChange = (productId: string) => {
        setUrgencyStates(prevState => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));
    };
    
    const toggleAllUrgency = () => {
        const newUrgencyStates: { [key: string]: boolean } = {};

        if (!checked) {
            selectedProductsArray.forEach(product => {
                newUrgencyStates[product.id] = false; 
            });
        } else {
            selectedProductsArray.forEach(product => {
                newUrgencyStates[product.id] = urgencyStates[product.id] || false; 
            });
        }

        setUrgencyStates(newUrgencyStates);
        setChecked(!checked);
        setSwitchSelectedAll(!checked);
    };

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Novo item</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Selecione os itens de urgência de <Text style={{ fontWeight: 'bold' }}>{categoryDescription}</Text></Text>
                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 20, paddingTop: 20 }}>
                            <Pressable
                                onPress={() => toggleAllUrgency()}
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Checkbox
                                    status={switchSelectedAll ? 'checked' : 'unchecked'}
                                    onPress={() => toggleAllUrgency()}
                                    color="#133567"
                                />
                                <Text style={{ fontSize: 14 }}>Nenhum item é de urgência</Text>
                            </Pressable>
                        </View>
                    </View>
                    <ScrollView style={{ padding: 20 }}>
                        {selectedProductsArray.length > 0 ? (
                            selectedProductsArray.map((product: Product) => (
                                <SimpleCard
                                    key={product.id}
                                    title={product.description}
                                    showSwitch={true} 
                                    disabled={checked}
                                    onSwitchChange={() => handleUrgencyChange(product.id)} 
                                />
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum produto selecionado.</Text>
                        )}
                    </ScrollView>
                    <View style={style.button}>
                        <Button
                            mode="contained"
                            buttonColor={Colors.backgroundButton}
                            contentStyle={{ height: 50, }}
                            textColor='#FFFFFF'
                            loading={loading}
                            disabled={loading}
                            onPress={() => {
                                handleSave();
                            }}
                        >
                            Salvar
                        </Button>
                    </View>
                </View>
            </View>
        </Provider>
    );
}

export default DonationItemUrgentForm;

const style = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontSize: 24,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    textInput: {
        flex: 1
    },
    block: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        marginBottom: 40,
    },
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productText: {
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        
    },
    checkboxBorder:{
        borderWidth: 2,
        borderColor: 'black',
    },
    checkbox: {
        borderWidth: 2,
        borderColor: 'black', 
        borderRadius: 4, 
        marginRight: 8, 
    },
    checkboxLabel: {
        fontSize: 16,
    },
});