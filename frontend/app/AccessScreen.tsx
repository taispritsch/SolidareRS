import React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { styles } from './styles';
import { Colors } from '@/constants/Colors';
import { Button } from 'react-native-paper';

const AccessScreen = () => {

    return (
        <View style={styles.login}>
            <Image source={require('@/assets/images/logo.png')} />
            <Text style={style.title}>SolidareRS</Text>
            <Text style={style.subtitle}>Conectando solidariedade e esperança</Text>
            <View style={style.button}>
                <Button
                    mode="contained"
                    buttonColor={Colors.backgroundHeader}
                    contentStyle={{ height: 60, borderRadius: 30 }}
                >
                    Acessar
                </Button>
            </View>

        </View>
    );
};

const style = StyleSheet.create({
    title: {
        fontSize: 50,
        fontFamily: 'Abril Fatface',
        marginTop: 60,
        fontWeight: 700,
    },
    subtitle: {
        fontSize: 20,
    },
    button: {
        marginTop: 78,
        width: 248,
    }

});

export default AccessScreen;