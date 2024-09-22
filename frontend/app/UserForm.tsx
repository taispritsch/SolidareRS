import React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewComponent, Alert } from "react-native";
import { Button, Snackbar, Switch, TextInput } from 'react-native-paper';
import { styles } from "./styles"
import { Colors } from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';

const UserForm = () => {
    const governmentId = useLocalSearchParams().id;
    const userId = useLocalSearchParams().userId;

    const [isSwitchOn, setIsSwitchOn] = React.useState(true);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const onInputName = (text: string) => setName(text);
    const onInputEmail = (text: string) => setEmail(text);
    const defineNameError = (status: boolean) => setNameError(status);
    const defineEmailError = (status: boolean) => setEmailError(status);
    const onLoading = () => setLoading(true);
    const offLoading = () => setLoading(false);

    function validateFields() {
        if (name === '' && email === '') {
            defineNameError(true);
            defineEmailError(true);
            return;
        }

        if (name === '') {
            defineNameError(true);
            return;
        }

        if (email === '') {
            defineEmailError(true);
            return;
        }

        defineNameError(false);
        defineEmailError(false);

        return true;
    }

    async function editUser() {
        if (!validateFields()) {
            return;
        }

        const data = {
            name,
            email,
            status: isSwitchOn ? 'active' : 'inactive',
        }

        try {
            onLoading();

            const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT_API}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                offLoading();
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Erro ao salvar usuário.');
                return;
            }

            router.back();
            router.setParams({ showSnackbar: 'true' });
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Falha na conexão. Tente novamente mais tarde.');
        }
    }

    async function handleSave() {
        if (!validateFields()) {
            return;
        }

        const data = {
            name,
            email,
            status: isSwitchOn ? 'active' : 'inactive',
            government_department_id: governmentId
        }

        try {
            onLoading();
            
            const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT_API}/users`, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                offLoading();
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Erro ao salvar usuário.');
                return;
            }

            router.back();
            router.setParams({ showSnackbar: 'true' });
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Falha na conexão. Tente novamente mais tarde.');
        }
    }

    async function getUser() {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT_API}/users/${userId}`, {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Erro ao buscar usuário.');
                return;
            }

            const data = await response.json();

            setName(data.name);
            setEmail(data.email);
            setIsSwitchOn(data.status === 'active');
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Falha na conexão. Tente novamente mais tarde.');
        }
    }

    React.useEffect(() => {
        if (userId) {
            getUser();
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={style.title}>Novo usuário</Text>
                <ScrollView>
                    <View style={style.form}>
                        <TextInput
                            mode="outlined"
                            label="Nome*"
                            value={name}
                            placeholder="Nome"
                            style={style.textInput}
                            selectionColor={Colors.backgroundButton}
                            activeOutlineColor={Colors.backgroundButton}
                            onChangeText={text => onInputName(text)}
                            error={nameError}
                        />
                        <TextInput
                            mode="outlined"
                            label="E-mail*"
                            value={email}
                            placeholder="exemplo@exemplo.com"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                            selectionColor={Colors.backgroundButton}
                            onChangeText={text => onInputEmail(text)}
                            autoCapitalize='none'
                            error={emailError}
                        />

                        <View style={style.formBlock}>
                            <Text style={{ fontSize: 14 }}>Status</Text>
                            <Switch
                                value={isSwitchOn}
                                onValueChange={onToggleSwitch}
                                color={Colors.backgroundButton}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={style.button}>
                    <Button
                        mode="contained"
                        onPress={() => userId ? editUser() : handleSave()}
                        buttonColor={Colors.backgroundButton}
                        contentStyle={{ height: 50 }}
                        loading={loading}
                        disabled={loading}
                    >
                        Salvar
                    </Button>
                </View>

            </View>
        </View>
    );
};

const style = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontSize: 24,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    textInput: {
        borderColor: 'red',
        flex: 1
    },
    formBlock: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        marginBottom: 40,
    }
});

export default UserForm;