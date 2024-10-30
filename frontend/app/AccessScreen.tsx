import React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from '@/constants/Colors';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

const AccessScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>SolidareRS</Text>
            <Text style={styles.subtitle}>Conectando solidariedade e esperança</Text>
            
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    buttonColor={Colors.backgroundHeader}
                    contentStyle={styles.primaryButtonContent}
                    style={styles.primaryButton}
                    onPress={() => router.push('/HomeScreenCommunity')}
                >
                    Acessar
                </Button>
                
                <Button
                    mode="outlined"
                    textColor={Colors.backgroundHeader}
                    style={styles.secondaryButton}
                    contentStyle={styles.secondaryButtonContent}
                    onPress={() => router.push('/LoginScreen')}
                >
                    <View style={styles.secondaryButtonTextContainer}>
                        <Text>Acessar como</Text>
                        <Text style={styles.secondaryButtonText}>Órgão público</Text>
                    </View>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9EC3FF', 
        padding: 16,
    },
    logo: {
        width: 324,
        height: 380,
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontFamily: 'Abril Fatface',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        width: '60%',
        fontSize: 18,
        textAlign: 'center',
        color: '#555',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '80%',
        alignItems: 'center',
    },
    primaryButton: {
        marginBottom: 20,
        width: '100%',
        borderRadius: 30,
    },
    primaryButtonContent: {
        height: 60,
    },
    secondaryButton: {
        width: '100%',
        borderRadius: 30,
        borderColor: Colors.backgroundButton,
        borderWidth: 2,
    },
    secondaryButtonContent: {
        height: 60,
    },
    secondaryButtonTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontWeight: '700',
        fontSize: 16,
    },
});

export default AccessScreen;
