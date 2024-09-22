import { Header } from '@/components/Header';
import React from 'react';
import { View, Text, ScrollView } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';

const WelcomeScreen = () => {
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const userName = useLocalSearchParams().userName;

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                <View style={styles.iconAndTextContainer}>
                    <Text style={styles.title}>Olá { userName }</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        <DynamicCard title="Locais" icon="map-outline" onPress={() => console.log('Locais')} />
                        <DynamicCard title="Usuários" icon="account-multiple" onPress={() => router.push({ pathname: '/UserScreen', params: { title: governmentName, id: governmentId } })} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default WelcomeScreen;