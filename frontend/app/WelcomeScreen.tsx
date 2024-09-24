import { Header } from '@/components/Header';
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useLocalSearchParams } from 'expo-router';
import { FAB, Portal, Provider } from 'react-native-paper';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';

const WelcomeScreen = () => {
    const [open, setOpen] = useState(false);
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const userName = useLocalSearchParams().userName;

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post(`logout`);
            if (response.status === 200) {
                await SecureStore.deleteItemAsync('token'); 
                Alert.alert('Sucesso', 'Logout bem-sucedido');
                router.push('/LoginScreen');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('Erro', 'Falha ao fazer logout.');
        }
    };
    

    return (
        <Provider>
            <View style={styles.container}>
                <Header />
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Text style={styles.title}>Olá{userName ? `, ${userName}` : ''}!</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            <DynamicCard title="Locais" icon="map-outline" onPress={() => console.log('Locais')} />
                            <DynamicCard title="Usuários" icon="account-multiple" onPress={() => router.push({ pathname: '/UserScreen', params: { title: governmentName, id: governmentId } })} />
                        </View>
                    </ScrollView>

                    <Portal>
                        <FAB.Group
                            open={open}
                            icon={open ? 'minus' : 'plus'}
                            visible={true}
                            actions={[
                                {
                                    icon: 'pencil',
                                    label: 'Editar',
                                    onPress: () => router.push(`/CityHallForm?id=${governmentId}&mode=edit`),
                                    style: {
                                        backgroundColor: '#0041A3',
                                    },
                                },
                                {
                                    icon: 'logout',
                                    label: 'Sair',
                                    onPress: handleLogout,
                                    style: { backgroundColor: '#0041A3' },
                                },
                            ]}
                            onStateChange={({ open }) => setOpen(open)}
                            onPress={() => {
                                if (!open) {

                                }
                            }}
                            fabStyle={{ backgroundColor: '#133567' }}
                        />
                    </Portal>

                </View>
            </View>
        </Provider>
    );
}

export default WelcomeScreen;