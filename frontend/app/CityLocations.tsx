import { Header } from "@/components/Header";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Icon, Provider, SegmentedButtons, Text } from "react-native-paper";
import { styles } from "./styles"
import axiosInstance from "@/services/axios";
import React, { useEffect } from "react";
import DynamicCard from "@/components/DynamicCard ";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import LocationCard from "@/components/LocationCard";

const CityLocations = () => {
    const governmentId = useLocalSearchParams().id;
    const [value, setValue] = React.useState('locais');
    const [places, setPlaces] = React.useState([]);

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

    useFocusEffect(
        React.useCallback(() => {
            getPlaces();
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
                        {places.map((place: any) => (
                            <LocationCard
                                key={place.id} 
                                name={place.description} 
                                distance={place.distance} 
                                onPress={() => handlePress(place)}
                            />
                        ))}
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

export default CityLocations;

