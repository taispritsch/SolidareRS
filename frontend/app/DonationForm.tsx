import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';
import { CategoriesIcons } from '@/constants/CategoriesIcons';
import { Button, Provider, Switch } from 'react-native-paper';
import SimpleCard from '@/components/SimpleCard';
import { Colors } from '@/constants/Colors';

const DonationForm = () => {
    const { placeName, donationPlaceId } = useLocalSearchParams();

    const [category] = useState(useLocalSearchParams());

    const [loading, setLoading] = useState(false);

    const [switchSelectedAll, setSwitchSelectedAll] = useState(false);

    const [products, setProducts] = useState<{
        id: BigInteger; selected: boolean; description: string
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

    const handleSave = async () => {
        setLoading(true);

        const selectedProducts = products.filter((product) => product.selected);

        const data = {
            donation_place_id: donationPlaceId,
            products: selectedProducts.map((product) => product.id),
        };

        try {
            console.log(data);
            const response = await axiosInstance.post('donations', data);

            console.log(response.data);

            setLoading(false);

            router.navigate({ pathname: '/DonationScreen', params: { title: placeName, donationPlaceId: donationPlaceId, placeName: placeName, showSnackbar: 'true' } });
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
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
                        <Text style={{ fontSize: 16, color: '#333' }}>Selecione os produtos de {category.description}</Text>
                    </View>
                    <ScrollView>
                        {products.length > 0 && (
                            <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 20 }}>
                                <Text style={{ fontSize: 14 }}>Selecionar tudo</Text>
                                <Switch
                                    value={switchSelectedAll}
                                    onValueChange={() => selectAllProducts()}
                                    color={Colors.backgroundButton}
                                />
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

export default DonationForm;

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
    }
});