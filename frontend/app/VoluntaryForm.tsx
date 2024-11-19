import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Switch, TextInput } from 'react-native-paper';
import { styles } from "./styles";
import { Colors } from '../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';

const VoluntaryForm = () => {
    const { governmentId } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [nameError, setNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const handleSubmit = async () => {
        setNameError(!name);
        setPhoneError(!phone);
    
        if (!name || !phone) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }
    
        setLoading(true);
    
        const volunteerData = {
            name,
            phone,
            government_department_id: governmentId,
        };
        
        try {
            const response = await axiosInstance.post('/community/volunteers', volunteerData);
    
            Alert.alert("Sucesso", "Voluntário registrado com sucesso!");
            setName('');
            setPhone('');
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Ocorreu um erro ao salvar o voluntário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{ ...styles.iconAndTextContainer, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text style={styles.title}>Seja voluntário!</Text>
                    <Text style={{ fontSize: 16, color: '#333' }}>Preencha o formulário abaixo para registrar seu interesse em ser voluntário.</Text>
                </View>

                <ScrollView>
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
                    </View>
                </ScrollView>
            
                <View style={style.button}>
                    <Button
                        mode="contained"
                        buttonColor={Colors.backgroundButton}
                        contentStyle={{ height: 50 }}
                        loading={loading}
                        disabled={loading}
                        onPress={handleSubmit}
                    >
                        Enviar
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

export default VoluntaryForm;
