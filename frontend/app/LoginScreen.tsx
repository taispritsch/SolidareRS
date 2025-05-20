import React, { useState } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image, Alert, ScrollView, Platform } from "react-native";
import { styles } from './styles';
import { Button, TextInput } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axiosInstance from '@/services/axios';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const validateFields = () => {
        let valid = true;

        if (email === '') {
            setEmailError(true);
            valid = false;
        } else {
            setEmailError(false);
        }

        if (password === '') {
            setPasswordError(true);
            valid = false;
        } else {
            setPasswordError(false);
        }

        return valid;
    };

    const handleLogin = async () => {
        
        if (!validateFields()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            setLoading(true);

            const response = await axiosInstance.post('login', {
                email,
                password,
            });

            const data = response.data;

            await SecureStore.setItemAsync('token', data.token);

            if (data.user.is_admin) {
                router.replace({ pathname: '/HomeScreen', params: { userName: data.user.name } });
            } else {
                const governmentDepartment = data.user.government_department_has_users[0].government_department;

                router.replace({ pathname: '/WelcomeScreen', params: { title: governmentDepartment.name, id: governmentDepartment.id, userName: data.user.name } });
            }

            setLoading(false);
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            Alert.alert('Erro', 'Erro ao fazer login.');
        }

        setLoading(false);
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
                            source={require('../assets/images/logo-bonito.png')}
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
                                error={emailError}
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
                                    error={passwordError}
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
                                        onPress={() => router.push('/ResetPasswordForm')}
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
                            onPress={() => handleLogin()}
                            style={style.loginButton}
                            buttonColor={Colors.backgroundButton}
                            contentStyle={{ height: 50 }}
                            loading={loading}
                            disabled={loading}
                            textColor='white'
                        >
                            {loading ? 'Aguarde, estamos fazendo login...' : 'Entrar'}
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
        elevation: 24,
        borderWidth: 1,
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
        color: 'white'
    }

});

export default LoginScreen;