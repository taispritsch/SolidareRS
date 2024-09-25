import { Header } from '@/components/Header';
import React, { useState } from 'react';
import { View, Text, ScrollView, BackHandler, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/services/axios';
import * as SecureStore from 'expo-secure-store';
import { FAB, Portal, Provider, Snackbar } from 'react-native-paper';

const WelcomeScreen = () => {
    const [open, setOpen] = useState(false);
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { userName, showSnackbar, action } = useLocalSearchParams();
    const [visible, setVisible] = React.useState(false);

    const onDismissSnackBar = () => setVisible(false);

    React.useEffect(() => {
        if (showSnackbar) {
            if (action === 'edit') {
                setSnackbarMessage('Órgão público editado com sucesso!');
            }
            setVisible(true);
        }

    }, [showSnackbar, action]);

    useFocusEffect(
        React.useCallback(() => {
            if (!router.canGoBack()) {
                const onBackPress = () => {
                    Alert.alert(
                        'Sair',
                        'Deseja realmente sair?',
                        [
                            {
                                text: 'Cancelar',
                                style: 'cancel'
                            },
                            { text: 'Sair', onPress: () => { BackHandler.exitApp(), router.replace({ pathname: '/LoginScreen' }) } }
                        ]
                    );
                    return true;
                };

                BackHandler.addEventListener('hardwareBackPress', onBackPress);

                return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            }
        }, [])
    );

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post(`logout`);
            if (response.status === 200) {
                await SecureStore.deleteItemAsync('token');
                Alert.alert('Sucesso', 'Logout bem-sucedido');
                router.replace('/LoginScreen');
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
                    <Snackbar
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        duration={1500}
                        action={{
                            label: 'Fechar',
                            onPress: () => {
                                onDismissSnackBar();
                            },
                        }}
                    >
                        {snackbarMessage}
                    </Snackbar>
                    <Portal>
                        <FAB.Group
                            open={open}
                            icon={open ? 'minus' : 'plus'}
                            visible={true}
                            color='#FFFFFF'
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