import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Switch, TextInput } from 'react-native-paper';
import { styles } from "./styles";
import { Colors } from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';

const PlaceForm = () => {
    const { id, mode } = useLocalSearchParams();

    const governmentDepartmentId = useLocalSearchParams().governmentId;

    const [description, setDescription] = useState('');
    const [zip_code, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [acceptsDonations, setAcceptsDonations] = useState(true);
    const [acceptsVolunteers, setAcceptsVolunteers] = useState(true);
    const [phone, setPhone] = useState('');

    const onToggleSwitchDonations = () => setAcceptsDonations(!acceptsDonations);
    const onToggleSwitchVolunteers = () => setAcceptsVolunteers(!acceptsVolunteers);

    const [descriptionError, setDescriptionError] = useState(false);
    const [zipCodeError, setZipCodeError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [streetError, setStreetError] = useState(false);
    const [neighborhoodError, setNeighborhoodError] = useState(false);
    const [numberError, setNumberError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [loading, setLoading] = useState(false);

    async function getDonationPlaces() {
        try {
            const response = await axiosInstance.get(`donation-places/${id}`);

            setDescription(response.data.description);
            setZipCode(response.data.address.zip_code || '');
            setStreet(response.data.address.street || '');
            setNeighborhood(response.data.address.neighborhood || '');
            setNumber(response.data.address.number || '');
            setComplement(response.data.address.complement || '');
            setCity(response.data.address.city.name);
            setPhone(response.data.phone);

            if (!response.data.accept_donation) {
                setAcceptsDonations(false);
            }

            if (!response.data.accept_volunteers) {
                setAcceptsVolunteers(false);
            }

        } catch (error: any) {
            console.error('Erro ao buscar os dados:', error);
            Alert.alert('Erro', error.response.data.message);
        }
    }

    useEffect(() => {
        if (mode === 'edit' && id) {
            getDonationPlaces();
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
        setZipCode(formattedText.replace(/(\d{5})(\d{1,3})/, '$1-$2'));

        if (formattedText.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${formattedText}/json/`);
                const data = await response.json();

                setStreet(data.logradouro || '');
                setNeighborhood(data.bairro || '');
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

        if (description === '') {
            setDescriptionError(true);
            valid = false;
        } else {
            setDescriptionError(false);
        }

        if (zip_code === '') {
            setZipCodeError(true);
            valid = false;
        } else {
            setZipCodeError(false);
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

        if (phone === '') {
            setPhoneError(true);
            valid = false;
        } else {
            setPhoneError(false);
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
            description,
            zip_code,
            street,
            neighborhood,
            number,
            complement,
            city_id: cityId,
            accept_donation: acceptsDonations,
            accept_volunteers: acceptsVolunteers,
            government_department_id: governmentDepartmentId,
            phone
        };

        setLoading(true);

        try {
            const method = mode === 'edit' ? 'PUT' : 'POST';
            const url = mode === 'edit'
                ? `donation-places/${id}`
                : 'donation-places';


            await axiosInstance({
                method,
                url,
                data,
            });

            router.back();
            router.setParams({ showSnackbar: 'true', action: mode === 'edit' ? 'edit' : 'create' });
        } catch (error: any) {
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
                    {mode === 'edit' ? 'Editando local' : 'Novo local'}
                </Text>
                <ScrollView>
                    <View style={style.form}>
                        <TextInput
                            mode="outlined"
                            label="Nome*"
                            placeholder="Nome"
                            value={description}
                            onChangeText={text => setDescription(text)}
                            style={style.textInput}
                            selectionColor={Colors.backgroundButton}
                            activeOutlineColor={Colors.backgroundButton}
                            error={descriptionError}
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
                            error={zipCodeError}
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
                            onChangeText={text => setStreet(text)}
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                            error={streetError}
                        />
                        <TextInput
                            mode="outlined"
                            label="Bairro*"
                            placeholder="Bairro"
                            value={neighborhood}
                            onChangeText={text => setNeighborhood(text)}
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
                                onChangeText={text => setNumber(text)}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                                error={numberError}
                            />
                            <TextInput
                                mode="outlined"
                                label="Complemento"
                                placeholder="Complemento"
                                value={complement}
                                onChangeText={text => setComplement(text)}
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                            />
                        </View>

                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, fontWeight: 500 }}>Aceita doações</Text>
                            <Switch
                                value={acceptsDonations}
                                onValueChange={onToggleSwitchDonations}
                                color={Colors.backgroundButton}
                            />
                        </View>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, fontWeight: 500 }}>Aceita voluntários</Text>
                            <Switch
                                value={acceptsVolunteers}
                                onValueChange={onToggleSwitchVolunteers}
                                color={Colors.backgroundButton}
                            />
                        </View>

                    </View>
                </ScrollView>
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
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 40,
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

export default PlaceForm;
