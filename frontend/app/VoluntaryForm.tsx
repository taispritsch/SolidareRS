import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Switch, TextInput } from 'react-native-paper';
import { styles } from "./styles";
import { Colors } from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';

const VoluntaryForm = () => {
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');

    const [descriptionError, setDescriptionError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);


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
                    </View>
                </ScrollView>
            
                <View style={style.button}>
                    <Button
                        mode="contained"
                        buttonColor={Colors.backgroundButton}
                        contentStyle={{ height: 50 }}
                        loading={loading}
                        disabled={loading}
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
