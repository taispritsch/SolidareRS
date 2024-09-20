import React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewComponent } from "react-native";
import { Button, Switch, TextInput } from 'react-native-paper';
import { styles } from "./styles"
import { Colors } from '../constants/Colors';

const UserForm = () => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);


    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={style.title}>Novo usuário</Text>
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
                            label="E-mail*"
                            placeholder="exemplo@exemplo.com"
                            style={style.textInput}
                            activeOutlineColor={Colors.backgroundButton}
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
        alignItems: 'center',
    },
    button: {
        marginBottom: 40,
    }
});

export default UserForm;