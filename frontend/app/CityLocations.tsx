import { Header } from "@/components/Header";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { FAB, Icon, Provider, SegmentedButtons, Text } from "react-native-paper";
import { styles } from "./styles"
import axiosInstance from "@/services/axios";
import React, { useEffect, useState } from "react";
import DynamicCard from "@/components/DynamicCard ";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import LocationCard from "@/components/LocationCard";
import CategoriesFilters from "@/components/CategoriesFilters";
import { CategoriesIcons } from "@/constants/CategoriesIcons";

const CityLocations = () => {
    const governmentId = useLocalSearchParams().id;
    const [value, setValue] = React.useState('locais');
    const [places, setPlaces] = React.useState([]);
    const [categories, setCategories] = useState<{ id: number, description: keyof typeof CategoriesIcons, selected: boolean }[]>([]);
    const [donationProducts, setdonationProducts] = useState<{ id: number; description: string; donation_id: number; category_description: string; subcategory_description: string }[]>([]);

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

    const getProducts = async (index?: number) => {
        let categoryFilter = null;
        if (index !== undefined) {
            categoryFilter = categories[index] && !categories[index].selected ? categories[index] : null;
        }

        try {
            const response = await axiosInstance.get(`donations/products`, {
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

    async function getPlaces() {
        try {
            const response = await axiosInstance.get(`donation-places/${governmentId}/government-department`);

            const array = response.data.map((item: any) => {
                return {
                    id: item.id,
                    description: item.description,
                }
            });

            setPlaces(array);
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível carregar os locais.');
        }
    }

    const handlePress = (place: any) => {
        router.push({ pathname: '/Location', params: { id: place.id, title: place.description } });
    };

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

    useFocusEffect(
        React.useCallback(() => {
            getPlaces();
            getProducts();
            getCategories();
        }, [])
    );

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
                                value: 'locais',
                                label: 'Locais',
                                style: value === 'locais' 
                                    ? style.activeButton 
                                    : style.inactiveButton,
                                labelStyle: value === 'locais' 
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
                         {value === 'locais' ? (
                            places.map((place: any) => (
                                <LocationCard
                                    key={place.id} 
                                    name={place.description} 
                                    distance={place.distance} 
                                    onPress={() => handlePress(place)}
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
                {value === 'locais' && (
                    <View style={style.tooltipButtonContainer}>
                        <View style={style.tooltipContainer}>
                            <Text style={style.tooltipText}>Seja voluntário</Text>
                        </View>
                        <FAB
                            style={style.fab}
                            icon="hand-heart"
                            color="white"
                            onPress={() => {
                                router.push({ pathname: '/VoluntaryForm' });
                            }}
                        />
                    </View>
                )}
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
    fab: {
        backgroundColor: Colors.backgroundHeader, 
    },
    tooltipButtonContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tooltipContainer: {
        padding: 8,
        borderRadius: 5,
        marginRight: 10, 
    },
    tooltipText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'semibold'
    },
});

export default CityLocations;

