import React, { useContext } from 'react';
import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { Icon, IconButton, Snackbar } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axiosInstance from '@/services/axios';

interface UserScreenProps {
    title: string;
}

const UserScreen = ({ title }: UserScreenProps) => {
    const governmentName = useLocalSearchParams().title;
    const governmentId = useLocalSearchParams().id;
    const showSnackbar = useLocalSearchParams().showSnackbar;

    const [users, setUsers] = React.useState([]);

    const [visible, setVisible] = React.useState(false);

    const onDismissSnackBar = () => setVisible(false);

    async function showDeleteAlert(id: BigInteger) {
        Alert.alert(
            "Excluir usuário",
            "Deseja realmente excluir esse usuário?",
            [
                {
                    text: "Cancelar",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "Excluir", onPress: () => { deleteUser(id) } }
            ]
        );
    }


    async function deleteUser(id: BigInteger) {
        try {
            await axiosInstance.delete(`users/${id}`);

            getUsers();
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Não foi possível excluir o usuário.');
        }
    }

    async function getUsers() {
        try {
            const response = await axiosInstance.get(`users/${governmentId}/government-department`);

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
        }
    }

    React.useEffect(() => {
        if (showSnackbar) {
            setVisible(true);
        }

        getUsers();


    }, [showSnackbar]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconAndTextContainer}>
                    <Icon source="account-multiple" color={'#202020'} size={30} />
                    <Text style={styles.title}>Usuários</Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 20 }}>
                        {users.map((user: any, index) => (
                            <DynamicCard
                                key={index}
                                title={user.name}
                                description={user.email}
                                hasOptionMenu
                                menuOptions={['editar', 'excluir']}
                                onDeletPress={() => showDeleteAlert(user.id)}
                                onEditPress={() => router.push({ pathname: '/UserForm', params: { title: governmentName, id: governmentId, userId: user.id } })}
                                onPress={() => router.push({ pathname: '/UserForm', params: { title: governmentName, id: governmentId, userId: user.id } })}
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
                    Usuário salvo com sucesso!
                </Snackbar>

                <IconButton
                    style={styles.addButton}
                    icon="plus"
                    iconColor={'#FFFFFF'}
                    size={40}
                    onPress={() => router.push({ pathname: '/UserForm', params: { title: governmentName, id: governmentId } })}
                    mode='contained'
                    containerColor={Colors.backgroundButton}
                />
            </View>
        </View>
    );
}

export default UserScreen;