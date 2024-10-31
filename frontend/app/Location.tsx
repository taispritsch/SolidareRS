import { Header } from "@/components/Header";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Icon, Provider, SegmentedButtons, Text } from "react-native-paper";
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
    const donationPlaceId = useLocalSearchParams().id;
    const [value, setValue] = React.useState('informacao');
    const [categories, setCategories] = useState<{ id: number, description: keyof typeof CategoriesIcons, selected: boolean }[]>([]);
    const [donationProducts, setdonationProducts] = useState<{ id: number; description: string; donation_id: number; category_description: string; subcategory_description: string }[]>([]);
    const [selectedDonation, setSelectedDonation] = useState<UrgentDonation | null>(null); 
    const [modalVisible, setModalVisible] = useState(false);
    const [productSizes, setProductSizes] = useState([]);
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
                    subcategory_description: product.subcategory_description
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

    const openViewSizesModal = async (product: UrgentDonation) => {
        setSelectedDonation(product);
        setModalVisible(true);

        try {
            const response = await axiosInstance.get('products/registered-urgent-variations', {
                params: { product_ids: [product.product_id] },
            });

            const variationsData = response.data;

            if (variationsData.length > 0) {
                setProductSizes(variationsData);
            } else {
                setProductSizes([]);
            }
        } catch (error) {
            console.error('Erro ao buscar variações:', error);
            setProductSizes([]); 
        } finally {
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
});

export default Location;