import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { styles } from "./styles";
import { Colors } from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';

const CityHallForm = () => {
    const { id, mode } = useLocalSearchParams();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [zip_code, setCep] = useState('');
    const [city, setCity] = useState('');
    const [street, setRua] = useState('');
    const [neighborhood, setBairro] = useState('');
    const [number, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');

    const [nameError, setNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [cepError, setCepError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [streetError, setStreetError] = useState(false);
    const [neighborhoodError, setNeighborhoodError] = useState(false);
    const [numberError, setNumberError] = useState(false);
    const [loading, setLoading] = useState(false);

    async function getGovernmentDepartment() {
        try {
            const response = await axiosInstance.get(`government-departments-auth/${id}`);

            setName(response.data.name);
            setPhone(response.data.phone || '');
            setCep(response.data.address.zip_code || '');
            setRua(response.data.address.street || '');
            setBairro(response.data.address.neighborhood || '');
            setNumero(response.data.address.number || '');
            setComplemento(response.data.address.complement || '');
            setCity(response.data.address.city.name);

        } catch (error: any) {
            console.error('Erro ao buscar os dados:', error);
            Alert.alert('Erro', error.response.data.message);
        }
    }

    useEffect(() => {
        if (mode === 'edit' && id) {
            getGovernmentDepartment();
        }
    }, []);


    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');

        // formatação (DDD) XXXXX-XXXX
        if (cleaned.length <= 2) {
            return `(${cleaned}`;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length <= 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
    };

    const handleCepChange = async (text: string) => {
        const formattedText = text.replace(/\D/g, '').slice(0, 8);
        setCep(formattedText.replace(/(\d{5})(\d{1,3})/, '$1-$2'));

        if (formattedText.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${formattedText}/json/`);
                const data = await response.json();

                setRua(data.logradouro || '');
                setBairro(data.bairro || '');
                setCity(data.localidade || '');

            } catch (error) {
                console.error('Erro ao buscar o CEP:', error);
            }
        } else {
            setCity('');
        }
    };

    const validateFields = () => {
        let valid = true;

        if (name === '') {
            setNameError(true);
            valid = false;
        } else {
            setNameError(false);
        }

        if (phone === '') {
            setPhoneError(true);
            valid = false;
        } else {
            setPhoneError(false);
        }

        if (zip_code === '') {
            setCepError(true);
            valid = false;
        } else {
            setCepError(false);
        }

        if (city === '') {
            setCityError(true);
            valid = false;
        } else {
            setCityError(false);
        }

        if (street === '') {
            setStreetError(true);
            valid = false;
        } else {
            setStreetError(false);
        }

        if (neighborhood === '') {
            setNeighborhoodError(true);
            valid = false;
        } else {
            setNeighborhoodError(false);
        }

        if (number === '') {
            setNumberError(true);
            valid = false;
        } else {
            setNumberError(false);
        }

        return valid;
    };

    const getCityId = async () => {
        try {
            const response = await axiosInstance.get('cities', {
                params: {
                    name: city,
                },
            });

            return response.data.id;

        } catch (error: any) {
            console.error('Erro ao buscar a cidade:', error);
            Alert.alert('Erro', error.response.data.message);
        }
    }

    const handleSubmit = async () => {
        if (!validateFields()) {
            return;
        }

        const cityId = await getCityId();

        const data = {
            name,
            phone,
            zip_code,
            street,
            neighborhood,
            number,
            complement: complemento,
            city_id: cityId,
        };

        setLoading(true);

        try {
            const method = mode === 'edit' ? 'PUT' : 'POST';
            const url = mode === 'edit'
                ? `government-departments-auth/${id}`
                : 'government-departments-auth';

            
            await axiosInstance({
                method,
                url,
                data,
            });

            router.back();
            router.setParams({ showSnackbar: 'true', action: mode === 'edit' ? 'edit' : 'create' });
        } catch (error : any) {
            console.error('Erro ao enviar a requisição:', error.response.data);
            Alert.alert('Erro', error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={style.title}>
                    {mode === 'edit' ? 'Editando órgão público' : 'Adicionando órgão público'}
                </Text>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "position"}
                    keyboardVerticalOffset={110}
                >
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={style.form}>
                            <TextInput
                                mode="outlined"
                                label="Nome*"
                                placeholder="Nome"
                                value={name}
                                onChangeText={text => setName(text)}
                                style={style.textInput}
                                selectionColor={Colors.backgroundButton}
                                activeOutlineColor={Colors.backgroundButton}
                                error={nameError}
                            />
                            <TextInput
                                mode="outlined"
                                label="Celular*"
                                placeholder="Celular"
                                value={phone}
                                keyboardType="numeric"
                                onChangeText={text => setPhone(formatPhoneNumber(text))}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                error={phoneError}
                            />
                            <TextInput
                                mode="outlined"
                                label="CEP*"
                                placeholder="CEP"
                                value={zip_code}
                                onChangeText={handleCepChange}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                keyboardType="numeric"
                                maxLength={9}
                                error={cepError}
                            />
                            <TextInput
                                mode="outlined"
                                label="Cidade*"
                                placeholder="Cidade"
                                value={city}
                                editable={false}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                error={cityError}
                            />
                            <TextInput
                                mode="outlined"
                                label="Rua*"
                                placeholder="Rua"
                                value={street}
                                onChangeText={text => setRua(text)}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                error={streetError}
                            />
                            <TextInput
                                mode="outlined"
                                label="Bairro*"
                                placeholder="Bairro"
                                value={neighborhood}
                                onChangeText={text => setBairro(text)}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                error={neighborhoodError}
                            />

                            <View style={style.block}>
                                <TextInput
                                    mode="outlined"
                                    label="Número*"
                                    placeholder="Número"
                                    keyboardType="numeric"
                                    value={number}
                                    onChangeText={text => setNumero(text)}
                                    style={style.textInput}
                                    activeOutlineColor={Colors.backgroundButton}
                                    error={numberError}
                                />
                                <TextInput
                                    mode="outlined"
                                    label="Complemento"
                                    placeholder="Complemento"
                                    value={complemento}
                                    onChangeText={text => setComplemento(text)}
                                    style={style.textInput}
                                    activeOutlineColor={Colors.backgroundButton}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={style.button}>
                    <Button
                        mode="contained"
                        buttonColor={Colors.backgroundButton}
                        onPress={handleSubmit}
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
        paddingBottom: Platform.OS === 'ios' ? 16 : 40,
    },
    textInput: {
        flex: 1
    },
    block: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        marginBottom: 40,
    }
});

export default CityHallForm;
