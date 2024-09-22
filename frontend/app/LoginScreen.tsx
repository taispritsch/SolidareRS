import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image, Alert, ScrollView, Platform } from "react-native";
import { styles } from './styles';
import { Button, TextInput } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT_API}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Erro', errorData.message || 'Erro ao fazer login.');
                return;
            }

            const data = await response.json();

            const governmentDepartment = data.user.government_department_has_users[0].government_department;

            if (data.user.is_admin) {
                router.push('/HomeScreen');
            } else {
                router.push({ pathname: '/WelcomeScreen', params: { title: governmentDepartment.name, id: governmentDepartment.id, userName: data.user.name } });
            }

        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Falha na conexão. Tente novamente mais tarde.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
                <View style={style.login}>
                    <View style={style.imageContainer}>
                        <Image
                            style={style.image}
                            source={require('../assets/images/logo.png')}
                        />
                    </View>

                    <View style={style.form}>
                        <View style={style.labels}>
                            <TextInput
                                label="E-mail"
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                autoCapitalize="none"
                                theme={{
                                    roundness: 8,
                                }}
                                activeOutlineColor={Colors.backgroundButton}
                                selectionColor={Colors.backgroundButton}
                            />
                            <View style={style.reset}>
                                <TextInput
                                    label="Senha"
                                    value={password}
                                    mode="outlined"
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    selectionColor={Colors.backgroundButton}
                                    activeOutlineColor={Colors.backgroundButton}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={() => setShowPassword(!showPassword)}
                                            color="#0041A3"
                                        />
                                    }
                                    theme={{
                                        roundness: 8,
                                    }}
                                />
                                <View style={style.resetButtonContainer}>
                                    <Button
                                        onPress={() => console.log('Redefinir senha')}
                                        textColor={Colors.backgroundButton}
                                        rippleColor="transparent"
                                        mode="text"
                                        compact
                                    >
                                        Redefinir senha
                                    </Button>
                                </View>
                            </View>

                        </View>

                        <Button
                            mode="contained"
                            //onPress={() => router.push(`/HomeScreen`)}
                            onPress={() => handleLogin()}
                            style={style.loginButton}
                            buttonColor={Colors.backgroundButton}
                            contentStyle={{ height: 50 }}
                        >
                            Entrar
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const style = StyleSheet.create({
    login: {
        flex: 1,
        backgroundColor: '#9EC3FF',
    },
    imageContainer: {
        width: '100%',
        height: '45%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '65%',
        resizeMode: 'contain',
    },
    form: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        height: '50%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#0041A3',
        shadowOpacity: 0.25,
        elevation: 0.25,
        borderWidth: 2,
        borderColor: '#0041A3',
        paddingTop: 80,
    },
    labels: {
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
    },
    reset: {
        display: 'flex',
    },
    resetButton: {
        textAlign: 'right',
    },
    resetButtonContainer: {
        alignItems: 'flex-end',
        color: 'red',
    },
    loginButton: {
        marginTop: 40,
    }

});

export default LoginScreen;