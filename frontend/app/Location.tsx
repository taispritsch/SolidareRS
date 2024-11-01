import { Header } from "@/components/Header";
import { Alert, ScrollView, StyleSheet, View, Modal } from "react-native";
import { ActivityIndicator, Button, Icon, Provider, SegmentedButtons, Text } from "react-native-paper";
import { styles } from "./styles"
import axiosInstance from "@/services/axios";
import React, { useEffect, useState } from "react";
import DynamicCard from "@/components/DynamicCard ";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { CategoriesIcons } from "@/constants/CategoriesIcons";
import CategoriesFilters from "@/components/CategoriesFilters";

interface UrgentDonation {
    id: number;
    product_id: number; 
    donation_place_id: number;  
    product_description: string;
    parent_category_description: string;
    urgent: boolean;
    subcategory_description: string;
    variations?: Variation[]; 
}

interface Variation {
    id: number;
    name: string,
    product_id: number,
    caracteristic_id: number,
    description: string;
}

const Location = () => {
    const { id: donationPlaceId, initialTab } = useLocalSearchParams();
    const [value, setValue] = React.useState((initialTab as string) || 'informacao');
    const [categories, setCategories] = useState<{ id: number, description: keyof typeof CategoriesIcons, selected: boolean }[]>([]);
    const [donationProducts, setdonationProducts] = useState<{ id: number; description: string; donation_id: number; category_description: string; subcategory_description: string }[]>([]);
    const [selectedDonation, setSelectedDonation] = useState<UrgentDonation | null>(null); 
    const [modalVisible, setModalVisible] = useState(false);
    const [productSizes, setProductSizes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            getProducts();
            getCategories();
        }, [])
    );

    const getCategories = async () => {
        try {
            const response = await axiosInstance.get('categories');

            const categories = response.data.map((category: { id: number; description: keyof typeof CategoriesIcons }) => {
                return {
                    id: category.id,
                    description: category.description,
                    selected: false
                }
            });

            setCategories(categories);

        } catch (error) {
            console.log(error);
        }
    }

    const cardTitles = [
        { title: "Horário para doações", route: `/DonationTime?id=${donationPlaceId}` },
        { title: "Horário para voluntários", route: `/VolunteeringTime?id=${donationPlaceId}` },
        { title: "Contato e Endereço", route: `/ContactAddress?id=${donationPlaceId}` },
    ];

    const handleCardPress = (route: any) => {
        router.push(route);
    };

    const getProducts = async (index?: number) => {
        let categoryFilter = null;
        if (index !== undefined) {
            categoryFilter = categories[index] && !categories[index].selected ? categories[index] : null;
        }
    
        try {
            const response = await axiosInstance.get(`donations/${donationPlaceId}/products`, {
                params: {
                    category_id: categoryFilter ? categoryFilter.id : null
                }
            });
    
            const products = response.data.map((product: { id: number; description: string; donation_id: number; category_description: string; subcategory_description: string }) => {
                return {
                    id: product.id,
                    description: product.description,
                    donation_id: product.donation_id,
                    category_description: product.category_description,
                    subcategory_description: product.subcategory_description,
                    product_description: product.description 
                }
            });
    
            setdonationProducts(products);
        } catch (error) {
            console.log(error);
        }
    }

    const selectCategory = (index: number) => {
        const newCategories = categories.map((category, i) => {
            return {
                ...category,
                selected: i === index ? !category.selected : false
            }
        });

        setCategories(newCategories);
        getProducts(index);
    }

    const fetchProductVariations = async (selectedProduct: any) => {
        const { id: productId, category_description: category } = selectedProduct;
    
        if (productId) {
            try {
                if (category === 'Roupas e calçados') {
                    const response = await axiosInstance.get('products/registered-variations', {
                        params: { product_ids: [productId] }, 
                    });
    
                    const variationsData = response.data;
    
                    const newProductVariations = variationsData.map((variation: any) => ({
                        id: variation.id,
                        name: variation.variation.description,
                        urgency: variation.urgent === 1,
                    }));
    
                    setProductSizes(newProductVariations);
                } else {
                    const productData = {
                        id: selectedProduct.donation_id || selectedProduct.id,
                        name: selectedProduct.description,
                        urgency: selectedProduct.urgency || false,
                    };
    
                    setProductSizes([productData]); 
                }
            } catch (error) {
                console.error('Erro ao buscar variações:', error);
            } finally {
                setLoading(false);
            }
        }
    };


    const openViewSizesModal = async (product: any) => {
        const donationData = {
            ...product,
            product_description: product.description,
        };
    
        setSelectedDonation(donationData);
        setModalVisible(true);
    
        if (product.category_description === 'Roupas e calçados') {
            await fetchProductVariations(donationData);
        } else {
            setLoading(false);
        }
    };
    
    return (
        <Provider>
          <View style={styles.container}>
            <View style={styles.content}>
                <SafeAreaView>
                    <SegmentedButtons
                        value={value}
                        onValueChange={setValue}
                        buttons={[
                            {
                                value: 'informacao',
                                label: 'Informação',
                                style: value === 'informacao' 
                                    ? style.activeButton 
                                    : style.inactiveButton,
                                labelStyle: value === 'informacao' 
                                    ? style.activeLabel 
                                    : style.inactiveLabel,
                            },
                            {
                                value: 'produtos',
                                label: 'Produtos',
                                style: value === 'produtos' 
                                    ? style.activeButton 
                                    : style.inactiveButton,
                                labelStyle: value === 'produtos' 
                                    ? style.activeLabel 
                                    : style.inactiveLabel,
                            },
                        ]}
                    />
                    <ScrollView style={style.content}>
                        {value === 'informacao' ? (
                            cardTitles.map((card, index) => (
                                <DynamicCard
                                    key={index}
                                    title={card.title} 
                                    onPress={() => handleCardPress(card.route)}
                                />
                            ))
                        ) : (
                            <View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 16, color: '#333' }}>Filtros</Text>
                                </View>
                                <ScrollView horizontal={true}
                                    style={{ backgroundColor: '#fff', height: 120 }}>
                                    {categories.map((category, index) => (
                                    <CategoriesFilters
                                        key={index}
                                        category={category}
                                        onPress={() =>
                                            selectCategory(index)
                                            }
                                        />
                                    ))}
                                </ScrollView>

                                <ScrollView>
                                    <View style={{ marginBottom: 50 }}>
                                        {donationProducts
                                            .filter(product => product.category_description === 'Roupas e calçados')
                                            .map((product, index) => (
                                                <DynamicCard
                                                    key={index}
                                                    title={product.description}
                                                    category={product.subcategory_description}
                                                    showButtonTopRight
                                                    showButtonTopRightText="Ver tamanhos"
                                                    notShowButton={true}
                                                    onPress={() => openViewSizesModal(product)}
                                                />
                                            ))}

                                        {donationProducts
                                            .filter(product => product.category_description !== 'Roupas e calçados')
                                            .map((product, index) => (
                                                <DynamicCard
                                                    key={index}
                                                    title={product.description}
                                                    notShowButton={true}
                                                />
                                            ))}
                                    </View>
                                </ScrollView>

                            </View >
                        )}
                    </ScrollView>
                </SafeAreaView>
            </View>
            {modalVisible && selectedDonation && (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={style.modalBackground}>
                            <View style={style.modalContent}>
                                <Text style={style.modalTitle}>{selectedDonation.product_description} - {selectedDonation.subcategory_description}</Text>
                                <Text style={{ marginTop: 10, color: '#000E19' }}>Tamanhos</Text>
                                
                                {loading ? (
                                    <ActivityIndicator size="large" color="#0000ff" />
                                ) : (
                                    productSizes && productSizes.length > 0 ? (
                                        <View style={style.sizesContainer}>
                                            {productSizes.map((size: Variation) => (
                                                <View key={size.id} style={style.cardContent}>
                                                    <Text style={{ color: '#000E19' }}>{size.name}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <Text>Nenhum tamanho encontrado.</Text>
                                    )
                                )}
                                
                                <View style={style.closeButtonContainer}>
                                    <Button mode="outlined" onPress={() => setModalVisible(false)} style={style.closeButton}>
                                        <Text style={style.closeButtonText}>Fechar</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
          </View>
        </Provider>
      );
};

const style = StyleSheet.create({
    content: {
        padding: 16,
    },
    activeButton: {
        backgroundColor: Colors.backgroundButton, 
        borderRadius: 20,
        borderColor: Colors.backgroundButton,
    },
    inactiveButton: {
        backgroundColor: "#E0E0E0", 
        borderRadius: 20,
        borderColor: "#E0E0E0",
    },
    activeLabel: {
        color: "#fff", 
    },
    inactiveLabel: {
        color: "#000", 
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'flex-start',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'semibold',
        marginBottom: 20,
        textTransform: 'capitalize',
        color: '#000E19',
      },
      modalSubtitle: {
        textAlign: 'left'
      },
      sizesContainer:{
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'center', 
        gap: 10,
        width: '100%', 
    },
    cardContent: {
        borderWidth: 2,
        borderColor: '#0041A3',
        borderRadius: 7,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
        height: 45,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        padding: 10,
        color: '#cardContent'
    },
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        width: '100%', 
        marginTop: 20,
    },
    closeButton: {
        backgroundColor: 'transparent',
        borderColor: '#0041A3',
        borderWidth: 2,
        width: '50%',
    },
    closeButtonText: {
        color: 'black',
    },
});

export default Location;