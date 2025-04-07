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
import SimpleCardClothes from '@/components/SimpleCardClothes';

const DonationClothesForm = () => {
    const { placeName, donationPlaceId } = useLocalSearchParams();

    const [category] = useState(useLocalSearchParams());

    const [subcategories, setSubcategories] = useState<{ id: BigInteger; description: string; selected: boolean }[]>([]);

    const [products, setProducts] = useState<{
        id: BigInteger; selected: boolean; description: string
    }[]>([]);

    const [variations, setVariations] = useState<{
        id: BigInteger; description: string; selectedAll: boolean; variations: [
            {
                id: BigInteger; selected: boolean; description: string; urgency: boolean
            }
        ]
    }[]>([]);

    const [loading, setLoading] = useState(false);

    const [switchSelectedAll, setSwitchSelectedAll] = useState(false);

    const [step, setStep] = useState(1);

    const getCategoriesClothes = async () => {
        try {
            const response = await axiosInstance.get(
                `categories-auth/${category.id}/subcategories`
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
                'products-auth/variations',
                {
                    params: {
                        product_ids: productIds
                    }
                }
            );

            const variations = response.data.map((product: {
                id: BigInteger; description: string; selectedAll: boolean; variations: [
                    {
                        id: BigInteger; description: string
                    }
                ]
            }) => {
                return {
                    id: product.id,
                    description: product.description,
                    selectedAll: false,
                    variations: product.variations.map((variation: {
                        id: BigInteger; description: string
                    }) => {
                        return {
                            id: variation.id,
                            description: variation.description,
                            selected: false,
                            urgency: false
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
                `categories-auth/${subCategoryId}/products/${donationPlaceId}`
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

    const lastStep = () => {
        setStep(step - 1);
    }

    const selectAllVariations = (indexProduct: number) => {
        const newVariations = variations.map((v, index) => {
            if (index === indexProduct) {
                v.selectedAll = !v.selectedAll;
                v.variations.map((variation) => {
                    variation.selected = v.selectedAll
                    return variation;
                });
            }
            return v;
        });

        setVariations(newVariations);
    }

    const handleUrgencyChange = (variationId: BigInteger) => {
        const newVariations = variations.map((v) => {
            v.variations.map((variation) => {
                if (variation.id === variationId) {
                    variation.urgency = !variation.urgency;
                }
                return variation;
            });
            return v;
        });

        setVariations(newVariations);
    }

    const toggleAllUrgency = () => {
        const newVariations = variations.map((v) => {
            v.variations.map((variation) => {
                if (variation.selected) {
                    variation.urgency = !switchSelectedAll;
                }
                return variation;
            });
            return v;
        });

        setVariations(newVariations);
        setSwitchSelectedAll(!switchSelectedAll);
    }

    useEffect((): void => {
        getCategoriesClothes();
    }, []);

    const handleSave = async () => {
        setLoading(true);

        const selectedVariations = variations.map((variation) => {
            return {
                product_id: variation.id,
                variations: variation.variations.filter((v) => v.selected).map((v) => {
                    return {
                        id: v.id,
                        urgency: v.urgency
                    };
                })
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
            await axiosInstance.post('donations-auth/clothes', data);

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
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione os produtos de <Text style={{ fontWeight: 'bold' }}>{category.description}</Text></Text>
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
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione os produtos de <Text style={{ fontWeight: 'bold' }}>{subcategories.find((subcategory) => subcategory.selected)?.description}</Text></Text>
                        </View>
                        <ScrollView>
                            {products.length > 0 && (
                                <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 20 }}>
                                    <Checkbox
                                        status={switchSelectedAll ? 'checked' : 'unchecked'}
                                        onPress={() => selectAllProducts()}
                                        color={Colors.backgroundButton}
                                    />
                                    <Text style={{ fontSize: 14 }}>Selecionar tudo</Text>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ paddingLeft: 10, alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    style={style.nextStepContainer}
                                    onPress={lastStep}
                                >
                                     <Text style={style.iconText}>‹‹</Text> 
                                    <Text style={style.nextStepText}>Passo anterior</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingRight: 10, alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    style={style.nextStepContainer}
                                    onPress={nextStep}
                                >
                                    <Text style={style.nextStepText}>Próximo passo</Text>
                                    <Text style={style.iconText}>››</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {step === 3 && (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={styles.title}>Novo item</Text>
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione os tamanhos para <Text style={{ fontWeight: 'bold' }}>{subcategories.find((subcategory) => subcategory.selected)?.description}</Text></Text>
                        </View>
                        <ScrollView>
                            {variations.length > 0 && variations.map((variation, indexProduct) => (
                                <View key={indexProduct}>
                                    <View style={{ ...styles.iconAndTextContainer, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 20, color: '#333', textTransform: 'uppercase', fontWeight: 600 }}>
                                            {variation.description}
                                        </Text>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 20 }}>
                                            <Checkbox
                                                status={variation.selectedAll ? 'checked' : 'unchecked'}
                                                onPress={() => selectAllVariations(indexProduct)}
                                                color={Colors.backgroundButton}
                                            />
                                            <Text style={{ fontSize: 14 }}>Selecionar tudo</Text>
                                        </View>
                                    </View>

                                    <View
                                        style={{
                                            columnGap: 10, flexWrap: 'wrap', gap: 10, position: 'relative', display: 'flex', flexDirection: 'row', padding: 20
                                        }}
                                    >
                                        {variation.variations.map((v, index) => (
                                            <View>
                                                <SimpleCardClothes
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

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{   }}>
                                <TouchableOpacity
                                    style={style.nextStepContainer}
                                    onPress={lastStep}
                                >
                                     <Text style={style.iconText}>‹‹</Text> 
                                    <Text style={style.nextStepText}>Passo anterior</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{  }}>
                                <TouchableOpacity
                                    style={style.nextStepContainer}
                                    onPress={nextStep}
                                >
                                    <Text style={style.nextStepText}>Próximo passo</Text>
                                    <Text style={style.iconText}>››</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View >
            )}

            {step === 4 && (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={styles.title}>Novo item</Text>
                            <Text style={{ fontSize: 16, color: '#333' }}>Selecione os itens que são de urgência para <Text style={{ fontWeight: 'bold' }}>{subcategories.find((subcategory) => subcategory.selected)?.description}</Text></Text>

                            <View style={{ flexDirection: 'row', paddingLeft: 20, paddingTop: 20 }}>
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
                        </View>
                        <ScrollView>
                            {variations.length > 0 && variations.map((variation, indexProduct) => (
                                <View key={indexProduct}>
                                    <View
                                        style={{ padding: 20 }}
                                    >
                                        {variation.variations.map((v, index) => (
                                            <View>
                                                {v.selected && (
                                                    <SimpleCard
                                                        key={index}
                                                        title={variation.description + ' - ' + v.description}
                                                        showSwitch={true}
                                                        isUrgente={true}
                                                        switchValue={v.urgency}
                                                        onSwitchChange={() => handleUrgencyChange(v.id)}
                                                    />
                                                )}
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
        marginRight: 8,
    },
});