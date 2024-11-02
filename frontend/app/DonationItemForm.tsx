import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';
import { CategoriesIcons } from '@/constants/CategoriesIcons';
import { Button, Checkbox, Provider, Switch } from 'react-native-paper';
import SimpleCard from '@/components/SimpleCard';
import { Colors } from '@/constants/Colors';

const DonationItemForm = () => {
    const { placeName, donationPlaceId } = useLocalSearchParams();

    const [category] = useState(useLocalSearchParams());

    const [loading, setLoading] = useState(false);

    const [switchSelectedAll, setSwitchSelectedAll] = useState(false);

    const [products, setProducts] = useState<{
        id: BigInteger; selected: boolean; description: string; category_description: string; urgent: boolean;
    }[]>([]);

    const getItemsByCategory = async () => {
        try {
            const response = await axiosInstance.get(
                `categories/${category.id}/products/${donationPlaceId}`
            );

            const products = response.data.map((product: {
                id: BigInteger; description: string
            }) => {
                return {
                    id: product.id,
                    description: product.description,
                    selected: false,
                    category_description: category.description,
                };
            });

            setProducts(products);
        } catch (error) {
            console.log(error);
        }
    }

    const selectProduct = (product: { id: BigInteger; selected: boolean; description: string }) => {
        const newProducts = products.map((p) => {
            if (p.id === product.id) {
                p.selected = !p.selected;
            }
            return p;
        });

        setProducts(newProducts);
    }

    const selectAllProducts = () => {
        const newProducts = products.map((product) => {
            product.selected = !switchSelectedAll;
            return product;
        });

        setProducts(newProducts);
        setSwitchSelectedAll(!switchSelectedAll);
    }


    useEffect((): void => {
        getItemsByCategory();
    }, []);


    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Novo item</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>Selecione os produtos de <Text style={{ fontWeight: 'bold' }}>{category.description}</Text></Text>
                    </View>
                    <ScrollView>
                        {products.length > 0 && (
                            <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 20, paddingTop: 20 }}>
                                <Pressable
                                    onPress={() => selectAllProducts()}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <Checkbox
                                        status={switchSelectedAll ? 'checked' : 'unchecked'}
                                        onPress={() => selectAllProducts()}
                                        color="#133567"
                                    />
                                    <Text style={{ fontSize: 14 }}>Selecionar tudo</Text>
                                </Pressable>
                            </View>
                        )}
                        <View style={{ padding: 20 }}>
                            {products.map((product, index) => (
                                <SimpleCard
                                    key={index}
                                    title={product.description}
                                    selected={product.selected}
                                    onPress={() => selectProduct(product)}
                                />
                            ))}
                        </View>

                        <View style={{ padding: 20 }}>
                            {products.length === 0 && (
                                <Text style={{ textAlign: 'center', marginTop: 20 }}>Todos os itens possíveis dessa categoria, foram cadastrados</Text>
                            )}
                        </View>
                    </ScrollView>
                    <View style={{ padding: 20, alignItems: 'flex-end' }}>
                        <TouchableOpacity
                            style={style.nextStepContainer}
                            onPress={() => {
                                const selectedProductIds = products
                                    .filter(product => product.selected)
                                    .map(product => ({
                                        id: product.id.toString(),
                                        description: product.description,
                                        parentCategory: product.category_description,
                                        urgency: false
                                    }));


                                const selectedProductsJson = JSON.stringify(selectedProductIds);

                                router.navigate({
                                    pathname: '/DonationItemUrgentForm',
                                    params: { 
                                        title: placeName, 
                                        donationPlaceId: donationPlaceId, 
                                        placeName: placeName,
                                        selectedProducts: selectedProductsJson,
                                        categoryDescription: category.description,
                                    } 
                                });
                            }}
                        >
                            <Text style={style.nextStepText}>Próximo passo</Text>
                            <Text style={style.iconText}>››</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Provider>
    );
}

export default DonationItemForm;

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