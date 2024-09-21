import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { styles } from './styles';
import { Button, TextInput } from 'react-native-paper';
import { Colors } from '@/constants/Colors';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
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
                        />
                        <Button
                            onPress={() => console.log('Redefinir senha')}
                            mode="text"
                            compact
                        >
                            Redefinir senha
                        </Button>
                    </View>

                </View>

                <Button
                    mode="contained"
                    onPress={() => console.log('Entrar')}
                    style={style.loginButton}
                    buttonColor={Colors.backgroundButton}
                    contentStyle={{ height: 50 }}
                >
                    Entrar
                </Button>
            </View>
        </View>
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
        width: '70%', 
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
    loginButton: {
        marginTop: 40,
    }

});

export default LoginScreen;