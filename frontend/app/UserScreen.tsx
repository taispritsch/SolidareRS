import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { FAB, Icon, IconButton, Portal, Provider, Snackbar } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axiosInstance from '@/services/axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface UserScreenProps {
    title: string;
}

const UserScreen = ({ title }: UserScreenProps) => {
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { showSnackbar, action } = useLocalSearchParams();
    const [users, setUsers] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const onDismissSnackBar = () => setVisible(false);

    async function showDeleteAlert(id: BigInteger) {
        Alert.alert(
            "Excluir usuário",
            "Deseja realmente excluir esse usuário?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Excluir", onPress: () => { deleteUser(id) } }
            ]
        );
    }


    async function deleteUser(id: BigInteger) {
        try {
            await axiosInstance.delete(`users-auth/${id}`);

            getUsers();
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível excluir o usuário.');
        }
    }

    async function getUsers() {
        setLoadingUsers(true);

        try {
            const response = await axiosInstance.get(`users-auth/${governmentId}/government-department`);

            const array = response.data.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name,
                    email: item.email,
                }
            });

            setUsers(array);
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível carregar os usuários.');
        } finally{
            setLoadingUsers(false);
        }
    }

    React.useEffect(() => {
        if (showSnackbar) {
            if (action === 'create') {
                setSnackbarMessage('Usuário criado com sucesso!');
            } else if (action === 'edit') {
                setSnackbarMessage('Usuário editado com sucesso!');
            }
            setVisible(true);
        }

    }, [showSnackbar, action]);

    useFocusEffect(
        React.useCallback(() => {
            getUsers();
        }, [])
    );

    return (
        <Provider>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconAndTextContainer}>
                        <Icon source="account-multiple" color={'#202020'} size={30} />
                        <Text style={styles.title}>Usuários</Text>
                    </View>
                    <ScrollView>
                        <View style={{ padding: 20 }}>
                            {loadingUsers ? (
                                <View style={{ alignItems: 'flex-start', marginVertical: 20 }}>
                                    <ShimmerPlaceholder 
                                    style={{ 
                                        height: 40,
                                        width: "50%", 
                                        marginBottom: 10, 
                                        borderRadius: 8 
                                    }} />
                                    <ShimmerPlaceholder 
                                    style={{ 
                                        height: 20,
                                        width: "80%", 
                                        marginBottom: 10, 
                                        borderRadius: 8 
                                    }} />
                                </View>
                            ) : users.length === 0 ? (
                                <Text style={{ textAlign: 'center' }}>Nenhum usuário cadastrado</Text>
                            ) : (
                                users.map((user: any, index) => (
                                    <DynamicCard
                                        key={index}
                                        title={user.name}
                                        description={user.email}
                                        hasOptionMenu
                                        menuOptions={['editar', 'excluir']}
                                        onDeletPress={() => showDeleteAlert(user.id)}
                                        onEditPress={() => router.push({ 
                                            pathname: '/UserForm', 
                                            params: { title: governmentName, id: governmentId, userId: user.id } 
                                        })}
                                        onPress={() => router.push({ 
                                            pathname: '/UserForm', 
                                            params: { title: governmentName, id: governmentId, userId: user.id } 
                                        })}
                                    />
                                ))
                            )}
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
                            router.push({ pathname: '/UserForm', params: { title: governmentName, id: governmentId } })
                        }}
                        color='#FFFFFF'
                        style={{ backgroundColor: '#133567', ...styles.addButton }}
                    />
                </View>
            </View>
        </Provider>
    );
}

export default UserScreen;