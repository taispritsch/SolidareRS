import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import { Colors } from '@/constants/Colors';
import { Button } from 'react-native-paper';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccessScreen = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useFocusEffect(
        useCallback(() => {
            const requestLocationPermission = async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
    
                if (status !== "granted") {
                    console.warn("Permissão de localização negada.");
                    return;
                }

                let locationData = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: locationData.coords.latitude,
                    longitude: locationData.coords.longitude,
                });
            };
    
            requestLocationPermission();
        }, [])
    );
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>SolidareRS</Text>
            <Text style={styles.subtitle}>Conectando solidariedade e esperança</Text>
            
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    buttonColor={Colors.backgroundHeader}
                    contentStyle={styles.primaryButtonContent}
                    style={styles.primaryButton}
                    onPress={() => {
                        if (location) {
                            router.push({
                                pathname: "/HomeScreenCommunity",
                                params: {
                                    lat: location.latitude,
                                    lon: location.longitude,
                                },
                            });
                        } else {
                            router.push({pathname: "/HomeScreenCommunity"});
                        }
                    }}
                >
                    Acessar
                </Button>
                
                <Button
                    mode="outlined"
                    textColor={Colors.backgroundHeader}
                    style={styles.secondaryButton}
                    contentStyle={styles.secondaryButtonContent}
                    onPress={() => router.replace('/LoginScreen')}
                >
                    <View style={styles.secondaryButtonTextContainer}>
                        <Text>Acessar como</Text>
                        <Text style={styles.secondaryButtonText}>Órgão público</Text>
                    </View>
                </Button>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#9EC3FF',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#9EC3FF',
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
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
