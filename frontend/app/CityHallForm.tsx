import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { styles } from "./styles"
import { Colors } from '../constants/Colors';

const CityHallForm = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={style.title}>Adicionando órgão público</Text>
                <ScrollView>
                    <View style={style.form}>
                        <TextInput
                            mode="outlined"
                            label="Nome*"
                            placeholder="Nome"
                            style={style.textInput}
                            selectionColor={Colors.backgroundButton}
                            activeOutlineColor={Colors.backgroundButton}
                        />
                        <TextInput
                            mode="outlined"
                            label="Celular*"
                            placeholder="Celular"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                        />
                        <TextInput
                            mode="outlined"
                            label="CEP*"
                            placeholder="CEP"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                        />
                        <TextInput
                            mode="outlined"
                            label="Cidade*"
                            placeholder="Cidade"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                        />
                        <TextInput
                            mode="outlined"
                            label="Rua*"
                            placeholder="Rua"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                        />
                        <TextInput
                            mode="outlined"
                            label="Bairro*"
                            placeholder="Bairro"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
                        />
                        <View style={style.formBlock}>
                            <TextInput
                                mode="outlined"
                                label="Rua*"
                                placeholder="Rua"
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                            />
                            <TextInput
                                mode="outlined"
                                label="Bairro*"
                                placeholder="Bairro"
                                style={style.textInput}
                                activeOutlineColor={Colors.backgroundButton}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={style.button}>
                <Button
                    mode="contained"
                    onPress={() => console.log('Pressed')}
                    buttonColor={Colors.backgroundButton}
                    contentStyle={{ height: 50 }}
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
    },
    button: {
        marginBottom: 40,
    }
});

export default CityHallForm;