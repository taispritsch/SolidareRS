import { Header } from "@/components/Header";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Icon, Provider, SegmentedButtons, Text } from "react-native-paper";
import { styles } from "./styles"
import axiosInstance from "@/services/axios";
import React, { useEffect } from "react";
import DynamicCard from "@/components/DynamicCard ";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const Location = () => {
    const [value, setValue] = React.useState('informacao');

    const cardTitles = [
        { title: "Horário para doações", route: "/DonationTime" },
        { title: "Horário para voluntários", route: "/VolunteeringTime" },
        { title: "Contato e Endereço", route: "/ContactAddress" },
    ];

    const handleCardPress = (route: any) => {
        router.push(route);
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
                        {cardTitles.map((card, index) => (
                            <DynamicCard
                                key={index}
                                title={card.title} 
                                onPress={() => handleCardPress(card.route)}
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

export default Location;