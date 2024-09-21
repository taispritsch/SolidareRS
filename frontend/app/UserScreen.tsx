import React, { useContext } from 'react';
import { View, Text, ScrollView } from "react-native";
import { styles } from './styles';
import DynamicCard from '@/components/DynamicCard ';
import { Icon, IconButton, Snackbar } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';

interface UserScreenProps {
    title: string;
}

const UserScreen = ({ title }: UserScreenProps) => {
    const governmentName = useLocalSearchParams().title;
    const showSnackbar = useLocalSearchParams().showSnackbar;

    const [users, setUsers] = React.useState([]);

    const [visible, setVisible] = React.useState(false);

    const onDismissSnackBar = () => setVisible(false);

    async function getUsers() {
        const response = await fetch(`http://192.168.0.106:8000/api/users/${3}`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).then(data => {

            const array = data.map((item: any) => {
                return {
                    name: item.name,
                    email: item.email,
                }
            });

            setUsers(array);

        }).catch(error => console.error(error));

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
                            onPress={() => console.log('Locais')} />
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
                    Usuário criado com sucesso!
                </Snackbar>

                <IconButton
                    style={styles.addButton}
                    icon="plus"
                    iconColor={'#FFFFFF'}
                    size={40}
                    onPress={() => router.push({ pathname: '/UserForm', params: { title: governmentName } })}
                    mode='contained'
                    containerColor={Colors.backgroundButton}
                />
            </View>
        </View>
    );
}

export default UserScreen;