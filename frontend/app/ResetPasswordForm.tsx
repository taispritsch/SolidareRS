import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, StyleSheet, View, Text, Platform, KeyboardAvoidingView, Image, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { styles } from "./styles"
import axiosInstance from "@/services/axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

const ResetPasswordForm = () => {
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [showPassword, setShowPassword] = React.useState(false);

    function validateFields() {
        if (email === '' && password === '') {
            setEmailError(true);
            setPasswordError(true);
            return;
        }

        if (email === '') {
            setEmailError(true);
            return;
        }

        if (password === '') {
            setPasswordError(true);
            return;
        }

        setEmailError(false);
        setPasswordError(false);

        return true;
    }

    async function resetPassword() {
        if (!validateFields()) {
            return;
        }

        try {
            setLoading(true);

            const response = await axiosInstance.post('reset-password', {
                email,
                password,
            });

            const data = response.data;

            await SecureStore.setItemAsync('token', data.token);

            const governmentDepartment = data.user.government_department_has_users[0].government_department;

            if (data.user.is_admin) {
                router.push('/HomeScreen');
            } else {
                router.push({ pathname: '/WelcomeScreen', params: { title: governmentDepartment.name, id: governmentDepartment.id, userName: data.user.name } });
            }

            setLoading(false);
        } catch (error : any) {
            console.error(error.response.data.message);
            Alert.alert('Erro', error.response.data.message);
            setLoading(false);
        }
    }

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
                        <Text style={style.title}>Redefinir senha</Text>
                        <View style={style.labels}>
                            <TextInput
                                mode="outlined"
                                label="E-mail*"
                                value={email}
                                placeholder="exemplo@exemplo.com"
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                selectionColor={Colors.backgroundButton}
                                onChangeText={setEmail}
                                autoCapitalize='none'
                                error={emailError}
                            />

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
                                error={passwordError}
                            />
                        </View>
                        <Text style={{ ...style.passwordRules, marginTop: 10 }}>Regras para a senha:</Text>
                        <Text style={style.passwordRules}>• No mínimo 8 caracteres</Text>
                        <Text style={style.passwordRules}>• Uma letra maiúscula</Text>
                        <Text style={style.passwordRules}>• Uma letra minúscula</Text>
                        <Text style={style.passwordRules}>• Um número</Text>
                        <Text style={style.passwordRules}>• Um caractere especial</Text>

                        <Button
                            mode="contained"
                            onPress={() => resetPassword()}
                            style={style.button}
                            buttonColor={Colors.backgroundButton}
                            contentStyle={{ height: 50 }}
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? 'Aguarde, estamos redefinindo sua senha...' : 'Entrar' }
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
    labels: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    title: {
        fontWeight: '700',
        fontSize: 18,
        paddingBottom: 30,
        paddingHorizontal: 20,
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
        marginTop: 40,
    },
    passwordRules: {
        color: 'gray',
        fontSize: 12,
        marginLeft: 10,
        marginBottom: 0,
        marginTop: 0,
        padding: 0,
    }
});

export default ResetPasswordForm;
