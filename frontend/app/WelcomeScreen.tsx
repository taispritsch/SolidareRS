import { Header } from '@/components/Header';
import React from 'react';
import { View, Text, ScrollView } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';

const WelcomeScreen = () => {
    const governmentName = useLocalSearchParams().title;

    console.log(governmentName);

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <View style={styles.iconAndTextContainer}>
                    <Text style={styles.title}>Olá FULANO</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <DynamicCard title="Locais" icon="map-outline" onPress={() => console.log('Locais')} />
                        <DynamicCard title="Usuários" icon="account-multiple" onPress={() => router.push({ pathname: '/UserScreen', params: { title: governmentName } })} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default WelcomeScreen;