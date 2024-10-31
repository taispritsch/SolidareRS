import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import { CategoriesIcons } from '@/constants/CategoriesIcons';
import { Button, Checkbox, Provider, Switch } from 'react-native-paper';
import SimpleCard from '@/components/SimpleCard';
import { Colors } from '@/constants/Colors';

interface Product {
    id: string;
    description: string;
    urgency: boolean;
    parentCategory?: string;
    donationId?: string;
}

interface ProductVariation {
    id: string;
    name: string;
    urgency: boolean;
}

const DonationItemUrgentForm = () => {
    const { selectedProducts, categoryDescription, donationPlaceId, isEditing, isUrgent, placeName } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [switchSelectedAll, setSwitchSelectedAll] = useState(false);
    const [productVariations, setProductVariations] = useState<ProductVariation[]>();
    const isEditingMode = isEditing === 'true';
    const isUrgentMode = isUrgent === 'true';

    let selectedProductsArray: Product[] = [];

    if (typeof selectedProducts === 'string') {
        try {
            selectedProductsArray = JSON.parse(selectedProducts);
        } catch (error) {
            console.error("Erro ao analisar selectedProducts:", error);
        }
    }

    let pageTitle;

    if (isEditingMode && !isUrgentMode) {
        pageTitle = 'Editar item';
    } else if (isEditingMode && isUrgentMode) {
        pageTitle = 'Editar item urgente';
    } else {
        pageTitle = 'Novo item';
    }

    const description = isEditingMode ? 'Editando informações de' : 'Selecione os itens de urgência de';

    const fetchProductVariations = async () => {
        const productIds = selectedProductsArray.map(product => product.id);
        const category = selectedProductsArray[0].parentCategory;

        if (productIds.length > 0) {
            try {
                if (category === 'Roupas e calçados') {
                    const response = await axiosInstance.get('products/registered-variations', {
                        params: { product_ids: productIds },
                    });

                    const variationsData = response.data;

                    const newProductVariations = variationsData.map((variation: any) => {
                        return {
                            id: variation.id,
                            name: variation.variation.description,
                            urgency: variation.urgent === 1 ? true : false,
                        };
                    });

                    setProductVariations(newProductVariations);
                } else {
                    const productsData = selectedProductsArray.map((product) => {
                        return {
                            id: product.donationId || product.id,
                            name: product.description,
                            urgency: product.urgency,
                        };
                    });

                    setProductVariations(productsData);
                }


            } catch (error) {
                console.error('Erro ao buscar variações:', error);
            }
        }
    };

    useEffect(() => {
        fetchProductVariations();
    }, []);

    const handleSave = async () => {
        setLoading(true);

        const data = {
            donation_place_id: donationPlaceId,
            products: selectedProductsArray.map((product) => ({
                id: product.id,
                urgent: product.urgency,
            })),
        };

        try {
            if (isUrgentMode && isEditingMode) {
                const productVariationsData = productVariations?.map((variation) => ({
                    id: variation.id,
                    urgent: variation.urgency,
                    product_id: selectedProductsArray[0].id,
                }));

                if (selectedProductsArray[0].parentCategory === 'Roupas e calçados') {
                    await axiosInstance.put('donations/update-urgency-clothes', {
                        ...productVariationsData,
                    });
                } else {
                    await axiosInstance.put('donations/update-urgency', {
                        ...productVariationsData
                    });
                }

                setLoading(false);

                router.navigate({
                    pathname: '/DonationScreen',
                    params: { title: categoryDescription, donationPlaceId, showSnackbar: 'true' }
                });
            } else {
                await axiosInstance.post('donations', data);

                setLoading(false);

                router.navigate({
                    pathname: '/DonationScreen',
                    params: { title: categoryDescription, donationPlaceId, showSnackbar: 'true' }
                });
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const toggleAllUrgency = () => {
        selectedProductsArray.forEach(product => {
            product.urgency = !product.urgency;
        });
    };

    const handleUrgencyChange = (variationId: any) => {
        const newProductVariations = productVariations?.map(variation => {
            if (variation.id === variationId) {
                return {
                    ...variation,
                    urgency: !variation.urgency,
                };
            }

            return variation;
        });

        setProductVariations(newProductVariations);
    };

    const showDeleteAlert = (donationItemId: any, productId: any) => {
        Alert.alert(
            "Excluir tamanho",
            "Deseja realmente excluir esse tamanho?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: () => deleteVariation(donationItemId, productId)
                }
            ]
        );
    };


    async function deleteVariation(donationItemId: number, productId: any) {
        try {
            await axiosInstance.delete(`products/variations/${donationItemId}`);

            if (productVariations && productVariations.length > 1) {
                fetchProductVariations();
            } else {
                router.navigate({ pathname: '/DonationScreen', params: { title: placeName, donationPlaceId: donationPlaceId, placeName: placeName, showSnackbar: 'true' } });
            }

        } catch (error) {
            console.error('Erro ao excluir a variação:', error);
            Alert.alert('Erro', 'Não foi possível excluir a variação.');
        }
    }


    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>{pageTitle}</Text>
                        <Text style={{ fontSize: 16, color: '#333' }}>{description} <Text style={{ fontWeight: 'bold' }}>{categoryDescription}</Text></Text>
                        {!isEditingMode && (
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
                                    <Text style={{ fontSize: 14 }}>Todos os itens são urgentes</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                    <ScrollView style={{ padding: 20 }}>
                        {selectedProductsArray.length > 0 ? (
                            selectedProductsArray.map((product: Product) => (
                                <View key={product.id}>
                                    {!isEditing && (
                                        <SimpleCard
                                            key={product.id}
                                            title={product.description}
                                            showSwitch={true}
                                            isUrgente={true}
                                            switchValue={product.urgency}
                                            onSwitchChange={() => product.urgency = !product.urgency}
                                        />
                                    )}
                                    {isEditing && isUrgent && (
                                        <View>{productVariations && productVariations.length > 0 && (
                                            productVariations.map(variation => (
                                                <SimpleCard
                                                    key={variation.id}
                                                    title={`${product.description} ${product.parentCategory === 'Roupas e calçados' ? '- ' + variation.name : ''}`}
                                                    showSwitch={true}
                                                    isUrgente={true}
                                                    switchValue={variation.urgency}
                                                    onSwitchChange={() => handleUrgencyChange(variation.id)}
                                                />
                                            ))
                                        )}
                                        </View>
                                    )}
                                    {isEditing && !isUrgent && (
                                        <View>
                                            {productVariations && productVariations.length > 0 && (
                                                productVariations.map(variation => (
                                                    <SimpleCard
                                                        key={variation.id}
                                                        title={`${product.description} - ${variation.name}`}
                                                        showSwitch={true}
                                                        switchValue={variation.urgency}
                                                        onSwitchChange={() => variation.urgency = !variation.urgency}
                                                        onDelete={() => showDeleteAlert(variation.id, product.id)}
                                                    />
                                                ))
                                            )}
                                        </View>
                                    )}
                                </View>
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
                                isEditing && !isUrgent ? router.navigate({ pathname: '/DonationScreen', params: { title: placeName, donationPlaceId: donationPlaceId, placeName: placeName, showSnackbar: 'true' } }) :
                                    handleSave();
                            }}
                        >
                            {isEditing && !isUrgent && (
                                'Voltar'
                            )}
                            {isEditing && isUrgent && (
                                'Salvar'
                            )}
                            {!isEditing && (
                                'Salvar'
                            )}
                        </Button>
                    </View>
                </View>
            </View>
        </Provider >
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
    checkboxBorder: {
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