import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { FAB, Icon, IconButton, Portal, Provider, Snackbar } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axiosInstance from '@/services/axios';

interface PlaceScreenProps {
    title: string;
}

const PlaceScreen = ({ title }: PlaceScreenProps) => {
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { showSnackbar, action } = useLocalSearchParams();

    const [places, setPlaces] = React.useState([]);

    const [visible, setVisible] = React.useState(false);

    const onDismissSnackBar = () => setVisible(false);

    async function showDeleteAlert(id: BigInteger) {
        Alert.alert(
            "Excluir local",
            "Todos os produtos serão deletados, deseja continuar?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Excluir", onPress: () => { deletePlace(id) } }
            ]
        );
    }


    async function deletePlace(id: BigInteger) {
        try {
            await axiosInstance.delete(`donation-places/${id}`);

            getPlaces();
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível excluir o local.');
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

    React.useEffect(() => {
        if (showSnackbar) {
            if (action === 'create') {
                setSnackbarMessage('Local criado com sucesso!');
            } else if (action === 'edit') {
                setSnackbarMessage('Local editado com sucesso!');
            }
            setVisible(true);
        }

    }, [showSnackbar, action]);

    useFocusEffect(
        React.useCallback(() => {
            getPlaces();
        }, [])
    );

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Icon source="map-outline" color={'#202020'} size={30} />
                        <Text style={styles.title}>Locais</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20, position: 'relative' }}>
                            {places.map((place: any, index) => (
                                <DynamicCard
                                    key={index}
                                    title={place.description}
                                    hasOptionMenu
                                    menuOptions={['editar', 'excluir']}
                                    onDeletPress={() => showDeleteAlert(place.id)}
                                    onEditPress={() => router.push({ pathname: '/PlaceForm', params: { title: governmentName, governmentId: governmentId, id: place.id, mode: 'edit' } })}
                                    onPress={() => router.push({ pathname: '/PlaceOptionsScreen', params: { title: governmentName, placeName: place.description, placeId: place.id } })}
                                />
                            ))}
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
                        }}>
                        {snackbarMessage}
                    </Snackbar>

                    <FAB
                        icon='plus'
                        onPress={() => {
                            router.push({ pathname: '/PlaceForm', params: { title: governmentName, governmentId: governmentId } });
                        }}
                        color='#FFFFFF'
                        style={{ backgroundColor: '#133567', ...styles.addButton }}
                    />
                </View>
            </View>
        </Provider>
    );
}

export default PlaceScreen;