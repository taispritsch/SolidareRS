import { Header } from "@/components/Header";
import { Alert, Modal, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, FAB, Icon, Provider, SegmentedButtons, Text } from "react-native-paper";
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

const CityLocations = () => {
    const governmentId = useLocalSearchParams().id;
    const [value, setValue] = React.useState('locais');
    const [places, setPlaces] = React.useState([]);
    const [categories, setCategories] = useState<{ id: number, description: keyof typeof CategoriesIcons, selected: boolean }[]>([]);
    const [donationProducts, setdonationProducts] = useState<{ id: number; description: string; donation_id: number; category_description: string; subcategory_description: string; donation_place_id: number; donation_place_description: string }[]>([]);
    const [selectedDonation, setSelectedDonation] = useState<UrgentDonation | null>(null); 
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [productSizes, setProductSizes] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

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
    
        setLoadingProducts(true); 

        try {
            const response = await axiosInstance.get(`donations/products`, {
                params: {
                    government_department_id: governmentId,
                    category_id: categoryFilter ? categoryFilter.id : null
                }
            });
    
            const products = response.data.map((product: { 
                id: number; 
                description: string; 
                donation_id: number; 
                category_description: string; 
                subcategory_description: string; 
                donation_place_id: number;
                donation_place_description: string 
            }) => {
                return {
                    id: product.id,
                    description: product.description,
                    donation_id: product.donation_id,
                    category_description: product.category_description,
                    subcategory_description: product.subcategory_description,
                    donation_place_id: product.donation_place_id,
                    donation_place_description: product.donation_place_description 
                }
            });
    
            setdonationProducts(products);
        } catch (error) {
            console.log(error);
        } finally{
            setLoadingProducts(false);
        }
    }
     

    async function getPlaces() {
        setLoading(true);
        
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
        } finally{
            setLoading(false);
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
                            loading ? (
                                <Text style={{ textAlign: 'center' }}>Carregando...</Text>
                            ) : places.length > 0 ? (
                                places.map((place: any) => (
                                    <LocationCard
                                        key={place.id} 
                                        name={place.description} 
                                        distance={place.distance} 
                                        onPress={() => handlePress(place)}
                                    />
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center' }}>Nenhum local cadastrado</Text>
                            )
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
                                        {loadingProducts ? (
                                            <Text style={{ textAlign: 'center', color: 'black' }}>Carregando...</Text>
                                        ) : donationProducts.length === 0 ? (
                                            <Text style={{ textAlign: 'center', color: 'black' }}>Nenhum produto cadastrado</Text>
                                        ) : (
                                            <>
                                                {donationProducts
                                                    .filter(product => product.category_description === 'Roupas e calçados')
                                                    .map((product, index) => (
                                                        <DynamicCard
                                                            key={index}
                                                            title={product.description}
                                                            category={product.subcategory_description}
                                                            notShowButton={true}
                                                            showLocation={true}
                                                            locationId={product.donation_place_id}
                                                            locationName={product.donation_place_description}
                                                            showButtonTopRight
                                                            showButtonTopRightText="Ver tamanhos"
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
                                                            showLocation={true}
                                                            locationId={product.donation_place_id}
                                                            locationName={product.donation_place_description}
                                                        />
                                                    ))}
                                            </>
                                        )}
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
                                router.push({
                                    pathname: '/VoluntaryForm',
                                    params: { governmentId, title: 'Voluntarie-se' }, 
                                });
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
        right: 26,
        bottom: 36,
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

export default CityLocations;

