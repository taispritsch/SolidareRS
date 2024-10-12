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

const DonationClothesForm = () => {
    const { placeName, donationPlaceId } = useLocalSearchParams();

    const [category] = useState(useLocalSearchParams());

    const [subcategories, setSubcategories] = useState<{ id: BigInteger; description: string; selected: boolean }[]>([]);

    const [products, setProducts] = useState<{
        id: BigInteger; selected: boolean; description: string
    }[]>([]);

    const [variations, setVariations] = useState<{
        id: BigInteger; description: string, variations: [
            {
                id: BigInteger; selected: boolean; description: string
            }
        ]
    }[]>([]);

    const [loading, setLoading] = useState(false);

    const [switchSelectedAll, setSwitchSelectedAll] = useState(false);

    const [step, setStep] = useState(1);

    const getCategoriesClothes = async () => {
        try {
            const response = await axiosInstance.get(
                `categories/${category.id}/subcategories`
            );

            const subcategories = response.data.map((subcategory: {
                id: BigInteger; description: string
            }) => {
                return {
                    id: subcategory.id,
                    description: subcategory.description,
                    selected: false,
                };
            });

            setSubcategories(subcategories);

        } catch (error) {
            console.log(error);
        }
    }

    const getVariablesByProduct = async () => {
        try {
            const productIds = products.filter((product) => product.selected).map((product) => product.id);
            const response = await axiosInstance.get(
                'products/variations',
                {
                    params: {
                        product_ids: productIds
                    }
                }
            );

            const variations = response.data.map((product: {
                id: BigInteger; description: string; variations: [
                    {
                        id: BigInteger; description: string
                    }
                ]
            }) => {
                return {
                    id: product.id,
                    description: product.description,
                    variations: product.variations.map((variation: {
                        id: BigInteger; description: string
                    }) => {
                        return {
                            id: variation.id,
                            description: variation.description,
                            selected: false,
                        };
                    })
                };
            });

            setVariations(variations);
        } catch (error) {
            console.log(error);
        }
    }

    const selectSubCategory = (subcategory: { id: BigInteger; description: string; selected: boolean }) => {
        const newSubcategories = subcategories.map((s) => {
            if (s.id === subcategory.id) {
                s.selected = !s.selected;
            }
            return s;
        });

        setSubcategories(newSubcategories);

        nextStep();
    }

    const selectAllProducts = () => {
        const newProducts = products.map((product) => {
            product.selected = !switchSelectedAll;
            return product;
        });

        setProducts(newProducts);
        setSwitchSelectedAll(!switchSelectedAll);
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

    const selectVariation = (variation: { id: BigInteger; selected: boolean; description: string }, indexProduct: number, indexVariation: number) => {
        const newVariations = variations.map((v, index) => {
            if (index === indexProduct) {
                v.variations[indexVariation].selected = !v.variations[indexVariation].selected;
            }
            return v;
        });

        setVariations(newVariations);
    }

    const getItemsByCategory = async () => {
        try {
            const subCategoryId = subcategories.find((subcategory) => subcategory.selected)?.id;
            const response = await axiosInstance.get(
                `categories/${subCategoryId}/products/${donationPlaceId}`
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

    const nextStep = () => {
        if (step === 2 && !products.some((product) => product.selected)) {
            return;
        }

        setStep(step + 1);

        if (step + 1 === 2) {
            getItemsByCategory();
        }

        if (step + 1 === 3) {
            getVariablesByProduct();
        }
    }

    useEffect((): void => {
        getCategoriesClothes();
    }, []);

    const handleSave = async () => {
        setLoading(true);

        const selectedVariations = variations.map((variation) => {
            return {
                product_id: variation.id,
                variations: variation.variations.filter((v) => v.selected).map((v) => v.id)
            };
        });

        if (selectedVariations.length === 0) {
            setLoading(false);
            return;
        }

        const data = {
            donation_place_id: donationPlaceId,
            variations: selectedVariations
        };

        try {
            await axiosInstance.post('donations/clothes', data);

            router.navigate({ pathname: '/DonationScreen', params: { title: placeName, donationPlaceId: donationPlaceId, placeName: placeName, showSnackbar: 'true' } });

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Provider>
            {step === 1 && (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={styles.title}>Novo item</Text>
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione qual a categoria do produto que deseja cadastrar</Text>
                        </View>

                        <ScrollView>
                            <View style={{ padding: 20 }}>
                                {subcategories.map((subcategory, index) => (
                                    <SimpleCard
                                        key={index}
                                        title={subcategory.description}
                                        onPress={() => selectSubCategory(subcategory)}
                                        selected={subcategory.selected}
                                    />
                                ))}
                            </View>


                        </ScrollView>
                    </View>
                </View>
            )}

            {step === 2 && (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={styles.title}>Novo item</Text>
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione os produtos de {
                                subcategories.find((subcategory) => subcategory.selected)?.description
                            }</Text>
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
                                mode="text"
                                onPress={nextStep}
                                icon="chevron-double-right"
                                contentStyle={{ flexDirection: 'row-reverse' }}
                                labelStyle={{ color: '#133567', fontWeight: '700' }}
                            >
                                Próximo passo
                            </Button>

                        </View>
                    </View>
                </View>
            )}

            {step === 3 && (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={styles.title}>Novo item</Text>
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione os tamanhos</Text>
                        </View>
                        <ScrollView>
                            {variations.length > 0 && variations.map((variation, indexProduct) => (
                                <View key={indexProduct}>
                                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 16, color: '#333' }}>
                                            {variation.description}
                                        </Text>
                                        {/* <Switch
                                        value={variation.variations.some((v) => v.selected)}
                                        onValueChange={() => selectProduct(variation)}
                                        color={Colors.backgroundButton}
                                    /> */}
                                    </View>

                                    <View
                                        style={{
                                            columnGap: 10, flexWrap: 'wrap', gap: 10, position: 'relative', display: 'flex', flexDirection: 'row', padding: 20
                                        }}
                                    >
                                        {variation.variations.map((v, index) => (
                                            <View>
                                                <SimpleCard
                                                    key={index}
                                                    title={v.description}
                                                    selected={v.selected}
                                                    isSmall={true}
                                                    onPress={() => selectVariation(v, indexProduct, index)}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                </View>
                            ))}
                        </ScrollView>

                        <View style={style.button}>
                            <Button
                                mode="contained"
                                buttonColor={Colors.backgroundButton}
                                contentStyle={{ height: 50 }}
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
                </View >
            )}
        </Provider >
    );
}

export default DonationClothesForm;

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
        padding: 20,
    }
});